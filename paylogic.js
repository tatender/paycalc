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

// Sunday
if(day===0){
 return 1.5
}

// Saturday
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

function calculateShiftPay(shift, rate, day){

  let pay = 0
  let hoursWorked = 0
  let currentDay = day

  for(let h = shift.start; h < shift.end; h += 1){

    if(hoursWorked >= 8) break

    const hour = Math.floor(h) % 24

    // if we pass midnight, increment day
    if(hour === 0 && h !== shift.start){
      currentDay = (currentDay + 1) % 7
    }

    const multiplier = getMultiplier(currentDay, hour)
    pay += rate * multiplier

    hoursWorked++
  }

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

 // display totals
 document.getElementById("week1Total")
 .innerText="$"+week1.toFixed(2)

 document.getElementById("week2Total")
 .innerText="$"+week2.toFixed(2)

 document.getElementById("grossTotal")
 .innerText="$"+(week1+week2).toFixed(2)

}




