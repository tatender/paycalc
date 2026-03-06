const shifts = [
{label:"10:00 - 18:30", start:10, end:18.5},
{label:"12:00 - 20:30", start:12, end:20.5},
{label:"15:00 - 23:30", start:15, end:23.5},
{label:"14:00 - 22:30", start:14, end:22.5},
{label:"20:00 - 04:30", start:20, end:28.5},
{label:"22:00 - 06:30", start:22, end:30.5}
]

const shiftCells = document.querySelectorAll(".shift-cell")

shiftCells.forEach(cell=>{

const select=document.createElement("select")

const blank=document.createElement("option")
blank.value=""
blank.text="RDO"
select.appendChild(blank)

shifts.forEach(shift=>{
const option=document.createElement("option")
option.value=JSON.stringify(shift)
option.text=shift.label
select.appendChild(option)
})

select.addEventListener("change",calculateTotals)

cell.appendChild(select)

})

document.getElementById("serviceRate").addEventListener("change",calculateTotals)

function calculateTotals(){

let week1=0
let week2=0
const rate=parseFloat(document.getElementById("serviceRate").value)

document.querySelectorAll(".week1 select").forEach(select=>{
if(select.value){
week1+=8*rate
}
})

document.querySelectorAll(".week2 select").forEach(select=>{
if(select.value){
week2+=8*rate
}
})

document.getElementById("week1Total").innerText="$"+week1.toFixed(2)
document.getElementById("week2Total").innerText="$"+week2.toFixed(2)
document.getElementById("grossTotal").innerText="$"+(week1+week2).toFixed(2)

}