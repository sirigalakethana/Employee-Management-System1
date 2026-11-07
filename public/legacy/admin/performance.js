const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) window.location.href="../index.html";
if (currentUser && currentUser.role !== "admin") window.location.href="../user/user-dashboard.html";

const sidebarAdminName=document.getElementById("sidebarAdminName");
const headerAdminName=document.getElementById("headerAdminName");
if(currentUser){ sidebarAdminName.textContent=currentUser.name||"Admin"; headerAdminName.textContent=currentUser.name||"Admin"; }
document.getElementById("currentDate").textContent=new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});

const defaultPerformance={attendance:90,task:85,teamwork:88,rating:4.0};
function getEmployees(){return (JSON.parse(localStorage.getItem("users"))||[]).filter(u=>u.role==="employee");}
function getPerformance(){return JSON.parse(localStorage.getItem("performanceRecords"))||{};}
function savePerformance(data){localStorage.setItem("performanceRecords",JSON.stringify(data));}
function label(score){if(score>=90)return "Excellent"; if(score>=75)return "Very Good"; if(score>=60)return "Good"; return "Needs Improvement";}
function row(employee,perf){const score=Math.round((perf.attendance+perf.task+perf.teamwork)/3); return `<tr><td><div class="employee-cell"><div class="employee-avatar-small">${(employee.name||"E").charAt(0).toUpperCase()}</div><div><strong>${employee.name}</strong><small>${employee.email}</small></div></div></td><td>${perf.attendance}%</td><td>${perf.task}%</td><td>${perf.teamwork}%</td><td><strong>★ ${Number(perf.rating).toFixed(1)}/5</strong></td><td><span class="performance-badge ${score>=90?'excellent':score>=75?'good':'needs'}">${label(score)}</span></td><td><button class="edit-button" onclick='openEdit(${JSON.stringify(employee.email)})'>Update</button></td></tr>`;}
function render(){const employees=getEmployees(); const records=getPerformance(); const table=document.getElementById("performanceTable"); let totalScore=0,totalRating=0; table.innerHTML=""; employees.forEach(e=>{if(!records[e.email]) records[e.email]={...defaultPerformance}; const p=records[e.email]; totalScore+=(p.attendance+p.task+p.teamwork)/3; totalRating+=Number(p.rating); table.insertAdjacentHTML("beforeend",row(e,p));}); savePerformance(records); document.getElementById("ratedCount").textContent=employees.length; document.getElementById("averageRating").textContent=employees.length?(totalRating/employees.length).toFixed(1)+" / 5":"0.0 / 5"; document.getElementById("averageScore").textContent=employees.length?Math.round(totalScore/employees.length)+"%":"0%"; if(!employees.length)table.innerHTML='<tr><td colspan="7" class="empty">No employees registered yet.</td></tr>'; }
function openEdit(email){const e=getEmployees().find(x=>x.email===email); const p=getPerformance()[email]||defaultPerformance; document.getElementById("editEmail").value=email; document.getElementById("modalEmployee").textContent=e?e.name:"Employee"; document.getElementById("editAttendance").value=p.attendance; document.getElementById("editTask").value=p.task; document.getElementById("editTeamwork").value=p.teamwork; document.getElementById("editRating").value=p.rating; document.getElementById("editModal").classList.remove("hidden");}
function closeModal(){document.getElementById("editModal").classList.add("hidden");}
document.getElementById("performanceForm").addEventListener("submit",e=>{e.preventDefault();const data=getPerformance();data[document.getElementById("editEmail").value]={attendance:Number(document.getElementById("editAttendance").value),task:Number(document.getElementById("editTask").value),teamwork:Number(document.getElementById("editTeamwork").value),rating:Number(document.getElementById("editRating").value)};savePerformance(data);closeModal();render();});
function logout(){localStorage.removeItem("currentUser");window.location.href="../index.html";}
render();