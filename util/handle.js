const { ObjectId } = require('mongodb');

class handleTime {
    static H_MPrint (time) {
        const printTime =
            time.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
            + ":" +
            time.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
        ;
        return printTime;
    };

    static D_M_YPrint () {
        const today = new Date();
        const date = today.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        const month = (today.getMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        const year = today.getFullYear();
        const print = year + "-" + month + "-" + date;
        return print.toString();
    };
    
    static workTime (begin, end, OWT) {
        const date = new Date();

        // Mẫu thời gian UTC
        const beginTime = date.setUTCHours( begin.slice(0, 2), begin.slice(-2) );
        const endTime = date.setUTCHours( end.slice(0, 2), end.slice(-2) );
        const oldTime = date.setUTCHours( OWT.slice(0, 2), OWT.slice(-2) );
        
        const time1 = endTime - beginTime;
        const time2 = time1 + oldTime - date;

        const showTime = (time) => {
            let hh = Math.floor(time/ 1000/ 60/ 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
            time -= hh*1000*60*60;
            let mm = Math.floor(time/ 1000/ 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
            return hh + ':' + mm;
        };
        const workTime = [ showTime(time1), showTime(time2) ];
        return workTime;
    };
}

class handleSalary {
    static workTime (workTime) {
        const h = parseInt(workTime.slice(0, 2), 10);
        const m = parseInt(workTime.slice(-2), 10)/ 60;
        const wt = h + m;
        return wt
    };

    static mmsToHour = (time) => {
        let hh = Math.floor(time/ 1000/ 60/ 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        time -= hh*1000*60*60;
        let mm = Math.floor(time/ 1000/ 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        return hh + ':' + mm;
    };

    static hourToMms = (time) => {
        const date = new Date();
        const timeArr = time.split(':');
        const mms = date.setTime(timeArr[0]*60*60*1000) + date.setTime(timeArr[1]*60*1000); // Don vi phut
        return mms;
    };

    static oTCal(time) {
        const mms = this.hourToMms(time);
        const oT = ((mms - 8*60*60*1000) > 0) ? this.mmsToHour(mms - 8*60*60*1000) : '00:00';
        return oT;
    };

    static getHour(time) {
        const timeArr = time.split(':');
        const hour = Number.parseInt(timeArr[0]) + Number.parseInt(timeArr[1])/60; // Don vi gio
        return hour;
    };

    static addHour(addArray) {
        let sumMms = 0;
        addArray.forEach(a => {
            const mms = this.hourToMms(a);
            sumMms += mms;
        })
        return this.mmsToHour(sumMms);
    };

    static diffHour(minusArray) {
        let diffMms = 0;
        minusArray.forEach((a, i) => {
            const mms = this.hourToMms(a);
            if (i === 0) diffMms = mms;
            else diffMms -= mms;
        });
        return this.mmsToHour(diffMms);
    };

    static getData(staff_id, data) {
        let i = 0;
        const dataHandle = data[0].map(d => {
            if (d.confirm) {
                const annuArr = data[1].regInformation.filter(a => (a.leaveDate === d.date && a.confirm));
                const A = {
                    staff_id: ObjectId(staff_id),
                    date: d.date,
                    begin: d.begin,
                    end: d.end,
                    at: d.at,
                    workTime: d.workTime,
                    totalWT: d.totalWorkTime,
                    annuArr: annuArr,
                    countIndex: i, // Đánh số tất cả data
                };
                i++;
                return A;
            } else return null;
        });
        return dataHandle.filter(a => a !== null);
    };

    static getSessionData(dateArray, data) {
        return dateArray.map(c => {
            const A = data.filter(a => a.date === c);
            const B = A.map(b => {
                return {
                    date: b.date,
                    begin: b.begin,
                    end: b.end,
                    at: b.at,
                    workTime: b.workTime,
                    countIndex: b.countIndex
                };
            });
            return B;
        });
    };

    static getDateData(dateArray, data) {
        return dateArray.map(d => {
            const A = data.filter(a => a.date === d);
            const index = A.length - 1;
            const sumAnnu = () => {
                let sum = 0;
                A[index].annuArr.forEach(a => sum += a.register);
                return this.mmsToHour(sum*60*60*1000);
            };
            const annu = ((A[index].annuArr.length !== 0) ? sumAnnu() : '00:00');
            const hourToSalary = this.addHour([A[index].totalWT, annu]);
            const B = {
                date: A[index].date,
                oT: this.oTCal(A[index].totalWT),
                totalWT: A[index].totalWT,
                hourToSalary: hourToSalary,
                annu: annu,
                lastSessionIndex: A[index].countIndex, // Nhận số đếm cuối trong cùng ngày
            };
            return B;
        });
    };

    static getMonthData(monthSearch, dateData) {
        const A = dateData.filter(a => a.date.search(monthSearch) !== -1);
        const dataArr = (key) => A.map(a => a[key]);
        const hourToSalary = this.addHour(dataArr('hourToSalary'));
        const standardTime = this.mmsToHour(20*8*60*60*1000);
        const loseTime = this.diffHour([standardTime, hourToSalary]);
        const B = {
            month: monthSearch,
            loseTime: this.getHour(loseTime),
            oT: this.getHour(
                this.addHour(dataArr('oT'))
            ),
        };
        return B;
    };
}

exports.handleTime = handleTime;
exports.handleSalary = handleSalary;