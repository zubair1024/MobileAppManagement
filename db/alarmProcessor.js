"use strict";

module.exports = {
    /**
    * Transact and persist alarm
    */
    transactAlarm: function (asset, alarmName, alarmFeature) {
        let me = this;
        //set the trigger time
        let triggerTime = Date.now();

        //create or update alarm
        db.Alarm.findOneAndUpdate({
            "_asset": asset._id,
            "name": alarmName,
            "triggered": true
        }, {
                "_asset": asset._id,
                "assetName": asset.assetName,
                "name": alarmName,
                "triggered": true,
                "triggerTime": triggerTime
            }, {
                new: true,
                upsert: true
            }, function (err, alarm) {
                if (err) {
                    console.log(err);
                } else {

                    me.transactAlarmEvent(asset, alarmName, alarmFeature, alarm);
                }

            });
        //end
    },

    /**
     * Transact and persist Alarm Event
     */
    transactAlarmEvent: function (asset, alarmName, alarmFeature, alarm) {
        let me = this;
        //create an alarm event
        new db.AlarmEvent({
            "_asset": asset._id,
            "assetName": asset.assetName,
            "_alarm": alarm._id,
            "alarmName": alarmName,
            "eventType": "trigger"
        }).save(function (err, alarmEvent) {
            if (err) {
                console.log('error transacting event');
                console.log(err);
            } else {
                //set the alarmed state
                asset.features[alarmFeature].alarmed = true;

                //triggerTime
                asset.features[alarmFeature].triggerTime = alarm.triggerTime;

                //persist the eventId on the asset
                asset.features[alarmFeature]._alarmEvent = alarmEvent._id

                //persist the asset
                me.transactAsset(asset);
            }
        });
    },

    /**
     * Transacting and persisting an asset
     * @param {*} asset An Asset Instance
     */
    transactAsset: function (asset) {
        db.Asset.findOneAndUpdate({ _id: asset._id }, asset, function (err, asset) {
            if (err) {
                console.log('error transacting asset');
                console.log(err);
            } else {
                console.log('Asset transacted successfully');
            }
        });
    }
}
