const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.database();

// 🔁 SCHEDULED FUNCTION: Runs every day at 3:01 PM IST
exports.autoFinalizeAttendance = functions.pubsub.schedule('1 15 * * *') // 3:01 PM daily
  .timeZone('Asia/Kolkata')
  .onRun(async (context) => {
    const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
    const attendancePath = `/attendance/${today}`;
    const leavePath = `/leave-logs/${today}`;

    console.log("📅 Finalizing attendance for:", today);

    const attendanceSnap = await db.ref(attendancePath).once('value');
    const attendanceData = attendanceSnap.val();

    if (!attendanceData) {
      console.log("⚠️ No attendance data found for today.");
      return null;
    }

    const updates = {};
    const leaveUpdates = {};

    for (const branch in attendanceData) {
      for (const sub in attendanceData[branch]) {
        const employees = attendanceData[branch][sub];

        for (const empId in employees) {
          const emp = employees[empId];

          // Only process if AN is missing or still 'None'
          const currentAN = emp.afternoon || 'None';
          if (currentAN === 'Enters' || currentAN === 'Leaves') continue;

          // Compute final leave
          const leave = emp.morning === true ? 0 : 1;

          updates[`${branch}/${sub}/${empId}/afternoon`] = 'None';
          updates[`${branch}/${sub}/${empId}/leave`] = leave;
          updates[`${branch}/${sub}/${empId}/finalized`] = true;

          leaveUpdates[`${branch}/${sub}/${empId}`] = leave;
        }
      }
    }

    await db.ref(attendancePath).update(updates);
    await db.ref(leavePath).update(leaveUpdates);

    console.log("✅ Attendance auto-finalized.");
    return null;
  });
