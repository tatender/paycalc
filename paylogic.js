// ----------------------------
// SHIFT DEFINITIONS
// ----------------------------

const shifts = [
 {label:"10:00 - 18:30", start:10, end:18.5},
 {label:"12:00 - 20:30", start:12, end:20.5},
 {label:"14:00 - 22:30", start:14, end:22.5},
 {label:"15:00 - 23:30", start:15, end:23.5},
 {label:"20:00 - 04:30", start:20, end:28.5},
 {label:"22:00 - 06:30", start:22, end:30.5},
 {label:"PL (Paid Leave)", start:10, end:18.5},
 {label:"PH (Public Holiday)", start:10, end:18.5, isPH:true},
 {label:"AL (Annual Leave)", isAL:true}
]

// ----------------------------
// PUBLIC HOLIDAYS
// ----------------------------

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

 const wrapper = document.createElement("div")
 wrapper.style.display = "flex"
 wrapper.style.flexDirection = "column"
 wrapper.style.alignItems = "center"

 const select = document.createElement("select")

 // RDO
 const blank = document.createElement("option")
 blank.value = ""
 blank.text = "RDO"
 select.appendChild(blank)

 // shifts
 shifts.forEach(shift=>{
  const option = document.createElement("option")
  option.value = JSON.stringify(shift)
  option.text = shift.label
  select.appendChild(option)
 })

 select.addEventListener("change",calculateTotals)

 // HD checkbox
 const hdLabel = document.createElement("label")
 hdLabel.style.fontSize = "12px"

 const hdCheckbox = document.createElement("input")
 hdCheckbox.type = "checkbox"
 hdCheckbox.classList.add("hd")
 hdCheckbox.style.marginTop = "4px"

 hdCheckbox.addEventListener("change",calculateTotals)

 hdLabel.appendChild(hdCheckbox)
 hdLabel.append(" HD")

 // OT checkbox
 const otLabel = document.createElement("label")
 otLabel.style.fontSize = "12px"

 const otCheckbox = document.createElement("input")
 otCheckbox.type = "checkbox"
 otCheckbox.classList.add("ot")

 otCheckbox.addEventListener("change",calculateTotals)

 otLabel.appendChild(otCheckbox)
 otLabel.append(" OT")

 // append everything
 wrapper.appendChild(select)
 wrapper.appendChild(hdLabel)
 wrapper.appendChild(otLabel)

 cell.appendChild(wrapper) // ✅ IMPORTANT FIX
})

document.getElementById("serviceRate")
.addEventListener("change",calculateTotals)


// ----------------------------
// PENALTY MULTIPLIER
// ----------------------------

function getMultiplier(day,hour){

 if(
  (day===6 && hour>=20) ||
  day===0 ||
  (day===1 && hour<7)
 ){
  return 1.5
 }

 if(day===6){
  if(hour>=7 && hour<19) return 1.25
  return 1.5
 }

 if(day===5){
  if(hour>=19) return 1.5
  if(hour<7) return 1.15
  return 1
 }

 if(day>=1 && day<=4){
  if(hour>=19) return 1.15
  if(hour<7) return 1.15
  return 1
 }

 return 1
}


// ----------------------------
// CALCULATE SHIFT PAY
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

  // minus unpaid 30 min
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

 let week1 = 0
 let week2 = 0

 const rate = parseFloat(document.getElementById("serviceRate").value)

 // WEEK 1
 document.querySelectorAll(".week1 .shift-cell")
 .forEach((cell,index)=>{

  const select = cell.querySelector("select")
  const hd = cell.querySelector(".hd")
  const ot = cell.querySelector(".ot")

  if(select && select.value){

   const shift = JSON.parse(select.value)
   const day = (index + 1) % 7

   let pay

   if(shift.isAL){
     pay = rate * 1.17 * 8
   }else if(shift.isPH){
     pay = rate * 1.5 * 8
   }else{
     pay = calculateShiftPay(shift, rate, day)
   }

   if(hd && hd.checked){
     pay *= 1.2
   }

   if(ot && ot.checked){
     pay *= 2
   }

   week1 += pay // ✅ FIXED
  }
 })

 // WEEK 2
 document.querySelectorAll(".week2 .shift-cell")
 .forEach((cell,index)=>{

  const select = cell.querySelector("select")
  const hd = cell.querySelector(".hd")
  const ot = cell.querySelector(".ot")

  if(select && select.value){

   const shift = JSON.parse(select.value)
   const day = (index + 1) % 7

   let pay

   if(shift.isAL){
     pay = rate * 1.17 * 8
   }else if(shift.isPH){
     pay = rate * 1.5 * 8
   }else{
     pay = calculateShiftPay(shift, rate, day)
   }

   if(hd && hd.checked){
     pay *= 1.2
   }

   if(ot && ot.checked){
     pay *= 2
   }

   week2 += pay // ✅ FIXED
  }
 })

 // totals
 document.getElementById("week1Total").innerText = "$" + week1.toFixed(2)
 document.getElementById("week2Total").innerText = "$" + week2.toFixed(2)

 const gross = week1 + week2

 document.getElementById("grossTotal").innerText = "$" + gross.toFixed(2)

 const net = gross * 0.78

 document.getElementById("netTotal").innerText = "$" + net.toFixed(2)
}
