/** Idempotent daily trigger installer (approximate schedule — not exact clock time). */
var DAILY_HANDLER = 'runDailySalesReport';

function installDailySalesTrigger() {
  ScriptApp.getProjectTriggers()
    .filter(function (trigger) {
      return trigger.getHandlerFunction() === DAILY_HANDLER;
    })
    .forEach(function (trigger) {
      ScriptApp.deleteTrigger(trigger);
    });

  ScriptApp.newTrigger(DAILY_HANDLER)
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();

  console.log('Installed daily trigger for ' + DAILY_HANDLER + ' (around 09:00 Asia/Tokyo).');
}

function removeDailySalesTrigger() {
  ScriptApp.getProjectTriggers()
    .filter(function (trigger) {
      return trigger.getHandlerFunction() === DAILY_HANDLER;
    })
    .forEach(function (trigger) {
      ScriptApp.deleteTrigger(trigger);
    });
  console.log('Removed triggers for ' + DAILY_HANDLER);
}
