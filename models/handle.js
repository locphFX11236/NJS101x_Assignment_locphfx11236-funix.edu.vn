class handleTime {
    static H_MPrint (time) {
        const printTime =
            time.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
            + ":" +
            time.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
        ;
        return printTime;
    }

    static D_M_YPrint () {
        const today = new Date();
        const date = today.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        const month = (today.getMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        const year = today.getFullYear();
        const print = year + "-" + month + "-" + date;
        return print.toString();
    }
    
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
    }
}

class handleSalary {
    static workTime (workTime) {
        const h = parseInt(workTime.slice(0, 2), 10);
        const m = parseInt(workTime.slice(-2), 10)/ 60;
        const wt = h + m;
        return wt
    }
}

exports.handleTime = handleTime;
exports.handleSalary = handleSalary;