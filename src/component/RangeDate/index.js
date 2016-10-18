import React, {Component}from 'react';

export default class RangeDate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate:null,
            endDate:null
        }
    }
    componentWillMount() {
        var date = new Date(),
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDay();
        this.setState({
            leftShowYear: year,
            leftShowMonth: month,
            leftShowDay: day,
            rightShowYear: month==12?year+1:year,
            rightShowMonth: month==12?1:month+1,
            rightShowDay: day,
            startSelectedYear: 0,
            startSelectedMonth: 0,
            startSelectedDay: 0,
            endSelectedYear: 0,
            endSelectedMonth: 0,
            endSelectedDay: 0,
            selectedCount: 0,
            isShowPicker: false
        });
    }
    /*算某个月的总天数*/
    getdaysinonemonth(year,month){
        month=parseInt(month,10);
        var d=new Date(year,month,0);
        return d.getDate();
    }
    /*算某个月的第一天是星期几*/
    getfirstday(year,month){
        month=month-1;
        var d=new Date(year,month,1);
        return d.getDay();
    }

    getStyle(year,month,day){
        var {startSelectedYear, startSelectedMonth, startSelectedDay, endSelectedYear, endSelectedMonth, endSelectedDay} = this.state;
        var now = new Date(),
            nowYear = now.getFullYear(),
            nowMonth = now.getMonth()+1,
            nowDay = now.getDate();
        var date = new Date(year,month,day),
            startDate = new Date(startSelectedYear, startSelectedMonth, startSelectedDay),
            endDate = new Date(endSelectedYear, endSelectedMonth, endSelectedDay);
        var style = "calendar-cell ";
        if(day == nowDay && month == nowMonth && year == nowYear) {
            style += "calendar-today ";
        }
        if(year == startSelectedYear && month == startSelectedMonth && day == startSelectedDay){
            style += "calendar-selected-day ";
        }
        if(year == endSelectedYear && month == endSelectedMonth && day == endSelectedDay){
            style += "calendar-selected-day ";
        }
        if(date < endDate && date > startDate){
            style += "calendar-range-cell ";
        }
        return style;
    }

    datePut(year,month,type) {

        var firstDay = this.getfirstday(year,month),
            monthCount = this.getdaysinonemonth(year,month),
            preMonthCount = this.getdaysinonemonth(year,month-1 == 0? 12: month-1);
        var day = 1;
        var start = false;
        var html =[];
        for(var i = 1; i < 7; i++){
            var td = [];
            if (i == 1 && firstDay!=7){
                for(var k = firstDay-1; k >= 0; k--){
                    td.unshift(<td key={k} className='calendar-cell calendar-last-month-cell' onClick={this.selected.bind(this,year,month,preMonthCount,"prev",type)}><div className='calendar-date'>{preMonthCount}</div></td>);
                    preMonthCount--;
                }
            }
            for (var j = 0; j < 7; j++){
                if (i == 1 && !start){
                    if ((firstDay == 7 && j == 0) || firstDay == j){
                        td.push(<td key={j} className={this.getStyle(year,month,day)} onClick={this.selected.bind(this,year,month,day,"this",type)}><div className='calendar-date'>{day}</div></td>);
                        day ++;
                        start = true;
                    }
                } else if (start && day <= monthCount){
                    td.push(<td key={j} className={this.getStyle(year,month,day)} onClick={this.selected.bind(this,year,month,day,"this",type)}><div className='calendar-date'>{day}</div></td>);
                    day ++;
                } else if (start && day > monthCount){
                    td.push(<td key={j} className='calendar-cell calendar-last-month-cell' onClick={this.selected.bind(this,year,month,day-monthCount,"next",type)}><div className='calendar-date'>{day-monthCount}</div></td>);
                    day ++;
                }
            }
            html.push(<tr>
                {td}
            </tr>)
        }
        return html;
    }

    singleTableSet(type) {
        var {leftShowYear, leftShowMonth, rightShowYear, rightShowMonth} = this.state;
        var date = new Date(),
            year = date.getFullYear(),
            month = date.getMonth() + 1;
        if (type == "left"){
            year = leftShowYear;
            month = leftShowMonth;
        } else if (type == "right"){
            year = rightShowYear;
            month = rightShowMonth;
        }
        return (
            <div>
                <div className='calendar-hearder'>
                    <a className='calendar-prev-year-btn' onClick={this.dateChange.bind(this,"year","prev",type)}></a>
                    <a className='calendar-prev-month-btn' onClick={this.dateChange.bind(this,"month","prev",type)}></a>
                    <span className='calendar-my-select'>
                        <a className='calendar-year-select txt-link'>{year}年</a>
                        <a className='calendar-month-select txt-link'>{month}月</a>
                    </span>
                    <a className='calendar-next-month-btn' onClick={this.dateChange.bind(this,"month","next",type)}></a>
                    <a className='calendar-next-year-btn' onClick={this.dateChange.bind(this,"year","next",type)}></a>
                </div>
                <div className='calendar-body'>
                    <table className='calendar-table'>
                        <thead>
                            <tr>
                                <th className='calendar-column-header'><span className='calendar-column-header-inner'>日</span></th>
                                <th className='calendar-column-header'><span className='calendar-column-header-inner'>一</span></th>
                                <th className='calendar-column-header'><span className='calendar-column-header-inner'>二</span></th>
                                <th className='calendar-column-header'><span className='calendar-column-header-inner'>三</span></th>
                                <th className='calendar-column-header'><span className='calendar-column-header-inner'>四</span></th>
                                <th className='calendar-column-header'><span className='calendar-column-header-inner'>五</span></th>
                                <th className='calendar-column-header'><span className='calendar-column-header-inner'>六</span></th>
                            </tr>
                        </thead>
                        <tbody className='calendar-tbody'>
                        {this.datePut(year,month,type)}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    rangeDateTableSet() {
        return  (
            <div className='calendar-picker-panel calendar-range'>
                <div className='calendar-picker-date-panel'>
                    <div className='calendar-range-part calendar-range-left'>{this.singleTableSet("left")}</div>
                    <div className='calendar-range-part calendar-range-right'>{this.singleTableSet("right")}</div>
                </div>
                <div className='calendar-footer'>
                    <a className="calendar-today-btn txt-link" onClick={this.today.bind(this)}>今天</a>
                    <a className='calendar-yesterday-btn txt-link' onClick={this.prevDay.bind(this,1)}>昨天</a>
                    <a className='calendar-last-week-btn txt-link' onClick={this.prevDay.bind(this,7)}>过去7天</a>
                    <a className='calendar-last-mooth txt-link' onClick={this.prevDay.bind(this,30)}>过去30天</a>
                </div>
            </div>

        );
    }

    show(){
        var {isShowPicker} = this.state;
        this.setState({
            isShowPicker: !isShowPicker
        });
    }

    selected(year,month,day,position,type){
        var {selectedCount, leftShowYear, leftShowMonth, rightShowYear, rightShowMonth} = this.state;
        var {startSelectedYear,startSelectedMonth, startSelectedDay, endSelectedYear, endSelectedMonth, endSelectedDay,} = this.state;
        var selectedYear,selectedMonth,selectedDay;

        if(position=="this"){
            selectedYear = year;
            selectedMonth = month;
            selectedDay = day;
        }else if(position=="prev"){
            selectedYear = month==1?year-1:year;
            selectedMonth = month==1?12:month-1;
            selectedDay = day;
        } else if(position=="next"){
            selectedYear = month==12?year+1:year;
            selectedMonth = month==12?1:month+1;
            selectedDay = day;
        }
        var selectedDate = new Date(selectedYear,selectedMonth,0),
            leftDate = new Date(leftShowYear,leftShowMonth,0),
            rightDate = new Date(rightShowYear,rightShowMonth,0);
        if(type == "left" && selectedDate < rightDate){
            this.setState({
                leftShowYear: selectedYear,
                leftShowMonth: selectedMonth
            });
        }else if(type == "right" && selectedDate > leftDate){
            this.setState({
                rightShowYear: selectedYear,
                rightShowMonth: selectedMonth
            });
        } else{
            return ;
        }
        if (selectedCount == 0){
            this.setState({
                startSelectedYear: selectedYear,
                startSelectedMonth: selectedMonth,
                startSelectedDay: selectedDay,
                endSelectedYear: 0,
                endSelectedMonth: 0,
                endSelectedDay: 0,
                startDate: selectedYear + "/" + selectedMonth + "/" + selectedDay,
                endDate: ""
            });

        } else if (selectedCount == 1){

            var startDate = new Date(startSelectedYear,startSelectedMonth,startSelectedDay),
                selectedDate = new Date(selectedYear,selectedMonth,selectedDay);
            if (selectedDate > startDate){
                this.setState({
                    endSelectedYear: selectedYear,
                    endSelectedMonth: selectedMonth,
                    endSelectedDay: selectedDay,
                    endDate: selectedYear + "/" + selectedMonth + "/" + selectedDay
                });
            }
        }
        if (startSelectedMonth != 0 && selectedMonth != 0 && startSelectedMonth < selectedMonth){
            this.setState({
                leftShowYear: startSelectedYear,
                leftShowMonth: startSelectedMonth,
                rightShowYear: selectedYear,
                rightShowMonth: selectedMonth
            });
        }
        this.setState({
            selectedCount: ++selectedCount%2
        });


    }


    dateChange(leve,direction,type){
        var {leftShowYear, leftShowMonth, rightShowYear, rightShowMonth} = this.state;
        var year,month,showYear,showMonth;

        if (type == "left"){
            showYear = leftShowYear;
            showMonth = leftShowMonth;
        } else if (type == "right"){
            showYear = rightShowYear;
            showMonth = rightShowMonth;
        }
        if(leve == 'year' && direction == 'prev'){
            year = showYear-1;
            month = showMonth;
        } else if(leve == 'year' && direction == 'next'){
            year = showYear + 1;
            month = showMonth;
        } else if(leve == 'month' && direction == 'prev'){
            year = showMonth==1? showYear - 1: showYear;
            month = showMonth==1? 12: showMonth -1;
        } else if(leve == 'month' && direction == 'next'){
            year = showMonth==12? showYear + 1: showYear;
            month = showMonth==12? 1: showMonth + 1;
        }
        var date = new Date(year,month,0),
            leftDate = new Date(leftShowYear,leftShowMonth,0),
            rightDate = new Date(rightShowYear,rightShowMonth,0);
        if (type == "left" && date < rightDate){
            this.setState({
                leftShowYear: year,
                leftShowMonth: month
            });
        } else if (type == "right" && date > leftDate){
            this.setState({
                rightShowYear: year,
                rightShowMonth: month
            });
        }

    }

    today(){
        var now = new Date(),
            year = now.getFullYear(),
            month = now.getMonth()+1,
            day = now.getDate();
        this.setState({
            leftShowYear: year,
            leftShowMonth: month,
            leftShowDay: day,
            rightShowYear: month==12?year+1:year,
            rightShowMonth: month==12?1:month+1,
        });
    }

    prevDay(prev){
        var now = new Date(),
            year = now.getFullYear(),
            month = now.getMonth()+1,
            day = now.getDate();
        var prevDay,prevMonth,prevYear;
        if(day-prev > 0 ){
            prevDay = day-prev;
            prevMonth = month;
            prevYear = year;
        }else {
            prevMonth = month == 1? 12: month - 1;
            prevYear = month == 1? year - 1: year;
            let count = this.getdaysinonemonth(prevYear,prevMonth);
            prevDay = count + day - prev;
            if (prevDay <= 0){
                prevMonth = month - 2;
                prevDay = count + + this.getdaysinonemonth(prevYear,prevMonth) + day - prev;
            }
        }
        var rightYear = year,
            rightMonth = month;
        if (prevMonth == month){
            rightYear = month==12?rightYear+1:rightYear;
            rightMonth = month==12?1:month+1;
        }
        this.setState({
            startSelectedYear: prevYear,
            startSelectedMonth: prevMonth,
            startSelectedDay: prevDay,
            endSelectedYear: year,
            endSelectedMonth: month,
            endSelectedDay: day,
            leftShowYear: prevYear,
            leftShowMonth: prevMonth,
            rightShowYear: rightYear,
            rightShowMonth: rightMonth
        });
    }


    onInputChange(type){
        let startDate = this.refs['startDate'].value;
        let endDate = this.refs['endDate'].value;
        this.setState({
            startDate,
            endDate
        });
        var dates;
        if(type=="left"){
            dates = startDate.split("/");
        }else if (type == "right"){
            dates = endDate.split("/");
        }
        var {leftShowYear, leftShowMonth, rightShowYear, rightShowMonth} = this.state;
        if (dates.length != 3){
            return ;
        }
        var date = new Date(dates[0],dates[1],dates[2]),
            start = new Date(leftShowYear, leftShowMonth,0),
            end = new Date(rightShowYear, rightShowMonth,0);
        if(type == "left" && date > end){
            return ;
        }
        if (type == "right" && date < start){
            return ;
        }
        if(type == "left"){
            this.setState({
                leftShowYear: dates[0],
                leftShowMonth: dates[1],
                startSelectedYear: dates[0],
                startSelectedMonth: dates[1],
                startSelectedDay: dates[2]
            })
        }else if(type=="right"){
            this.setState({
                rightShowYear: dates[0],
                rightShowMonth: dates[1],
                endSelectedYear: dates[0],
                endSelectedMonth: dates[1],
                endSelectedDay: dates[2]
            })
        }
    }

    render() {
        var {isShowPicker} = this.state;
        var style = isShowPicker?"calendar-picker  calendar-range-picker calendar-picker-action":"calendar-picker  calendar-range-picker ";
        let {startDate, endDate} = this.state;
        return (
            <div className={style}>
                <div className="calendar-picker-input-wrapper" onClick={this.show.bind(this)}>
                    <input  type="text" value={startDate} onChange={this.onInputChange.bind(this,"left")}  ref="startDate" className="calendar-picker-range-input" placeholder="开始日期"/>
                    <span>~</span>
                    <input  type="text" value={endDate}  onChange={this.onInputChange.bind(this,"right")} ref="endDate" className="calendar-picker-range-input" placeholder="结束日期" />
                    <span className="icon-calendar-picker"></span>
                </div>
                {this.rangeDateTableSet()}
            </div>
        );
    }
}