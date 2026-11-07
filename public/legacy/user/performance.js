const currentUser=JSON.parse(localStorage.getItem("currentUser"));
if(!currentUser) window.location.href="../index.html";
if(currentUser && currentUser.role!=="employee") window.location.href="../admin/admin-dashboard.html";
const profileAvatar=document.getElementById("profileAvatar"),headerName=document.getElementById("headerName"),employeeTitle=document.getElementById("employeeTitle");
if(currentUser){headerName.textContent=currentUser.name;employeeTitle.textContent=currentUser.name+" - Performance";profileAvatar.textContent=(currentUser.name||"E").charAt(0).toUpperCase();}
const defaults={attendance:90,task:85,teamwork:88,rating:4.0};
const records=JSON.parse(localStorage.getItem("performanceRecords"))||{};
const p=records[currentUser.email]||defaults;
function setMetric(id,bar,value){document.getElementById(id).textContent=value+"%";document.getElementById(bar).style.width=value+"%";}
setMetric("attendance","attendanceBar",p.attendance);setMetric("task","taskBar",p.task);setMetric("teamwork","teamworkBar",p.teamwork);document.getElementById("rating").textContent=Number(p.rating).toFixed(1);const score=(p.attendance+p.task+p.teamwork)/3;let status="Needs Improvement",text="Focus on improving consistency across the performance areas.";if(score>=90){status="Excellent";text="Outstanding performance. Keep up the excellent work!";}else if(score>=75){status="Very Good";text="Good progress. Keep maintaining consistent performance.";}else if(score>=60){status="Good";text="You are doing well. Continue improving your performance.";}document.getElementById("status").textContent=status;document.getElementById("statusText").textContent=text;document.getElementById("stars").textContent="★".repeat(Math.round(p.rating))+"☆".repeat(5-Math.round(p.rating));
function logout(){localStorage.removeItem("currentUser");window.location.href="../index.html";}