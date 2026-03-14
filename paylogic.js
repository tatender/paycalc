// ----------------------------
// SHIFT DEFINITIONS
// ----------------------------
// start and end use 24 hour decimal time
// overnight shifts extend past 24

const shifts = [
 {label:"10:00 - 18:30", start:10, end:18.5},
 {label:"12:00 - 20:30", start:12, end:20.5},
 {label:"14:00 - 22:30", start:14, end:22.5},
 {label:"15:00 - 23:30", start:15, end:23.5},
 {label:"20:00 - 04:30", start:20, end:28.5},
 {label:"22:00 - 06:30", start:22, end:30.5}
]

// ----------------------------
// PUBLIC HOLIDAYS
// ----------------------------
// format: YYYY-MM-DD
// add or remove dates anytime

const publicHolidays = [
"2026-01-01",
"2026-01-26",
"2026-12-25"
]

// ----------------------------
// BUILD SHIFT DROPDOWNS
// ----------------------------

const shiftCells = document.querySelectorAll(".shift-cell")

shiftCells.forEach(cell=>{

 const select=document.createElement("select")

 // RDO option
 const blank=document.createElement("option")
 blank.value=""
 blank.text="RDO"
 select.appendChild(blank)

 // add shifts
 shifts.forEach(shift=>{
  const option=document.createElement("option")
  option.value=JSON.stringify(shift)
  option.text=shift.label
  select.appendChild(option)
 })

 select.addEventListener("change",calculateTotals)

 cell.appendChild(select)

})

document.getElementById("serviceRate")
.addEventListener("change",calculateTotals)


// ----------------------------
// PENALTY MULTIPLIER FUNCTION
// ----------------------------

function getMultiplier(day,hour){

// Sat 20:00 → Mon 07:00
if(
 (day===6 && hour>=20) ||
 day===0 ||
 (day===1 && hour<7)
){
 return 1.5
}

// Saturday daytime
if(day===6){
 if(hour>=7 && hour<19) return 1.25
 return 1.5
}

// Friday
if(day===5){
 if(hour>=19) return 1.5
 if(hour<7) return 1.15
 return 1
}

// Monday–Thursday
if(day>=1 && day<=4){
 if(hour>=19) return 1.15
 if(hour<7) return 1.15
 return 1
}

return 1
}


// ----------------------------
// CHECK IF PUBLIC HOLIDAY
// ----------------------------

function isPublicHoliday(dateString){
 return publicHolidays.includes(dateString)
}


// ----------------------------
// CALCULATE PAY FOR ONE SHIFT
// ----------------------------

function calculateShiftPay(shift, rate, startDay) {
  let pay = 0

  for (let h = 0; h < (shift.end - shift.start); h += 0.5) {
    const absoluteHour = shift.start + h
    const hour = absoluteHour % 24
    const dayOffset = Math.floor(absoluteHour / 24)
    const currentDay = (startDay + dayOffset) % 7

    const multiplier = getMultiplier(currentDay, hour)

    pay += rate * multiplier * 0.5
  }

  // subtract unpaid 30 min
  // assume last multiplier applies for simplicity
  const lastHour = (shift.end - 0.5) % 24
  const lastDayOffset = Math.floor((shift.start + (shift.end - shift.start - 0.5)) / 24)
  const lastDay = (startDay + lastDayOffset) % 7
  const lastMultiplier = getMultiplier(lastDay, lastHour)
  pay -= rate * lastMultiplier * 0.5

  return pay
}


// ----------------------------
// TOTAL CALCULATOR
// ----------------------------

function calculateTotals(){

 let week1=0
 let week2=0

 const rate=parseFloat(document.getElementById("serviceRate").value)

 // week1
 document.querySelectorAll(".week1 select")
 .forEach((select,index)=>{

  if(select.value){

   const shift=JSON.parse(select.value)

   const day = (index + 1) % 7
   const pay = calculateShiftPay(shift, rate, day)

   week1+=pay
  }

 })

 // week2
 document.querySelectorAll(".week2 select")
 .forEach((select,index)=>{

  if(select.value){

   const shift=JSON.parse(select.value)

   const day = (index + 1) % 7
   const pay = calculateShiftPay(shift, rate, day)

   week2+=pay
  }

 })

 document.getElementById("week1Total")
 .innerText="$"+week1.toFixed(2)

 document.getElementById("week2Total")
 .innerText="$"+week2.toFixed(2)

 document.getElementById("grossTotal")
 .innerText="$"+(week1+week2).toFixed(2)

}












