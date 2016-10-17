import React, {Component}from 'react';

export default class Dates extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        var date = new Date();
        this.setState({
            showYear: date.getFullYear(),
            showMonth: date.getMonth()+1,
            showDay: date.getDay(),
            selectedYear: 0,
            selectMonth: 0,
            selectedDay: 0,
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
    datePut(year,month) {
        var {selectedYear,selectedMonth,selectedDay} = this.state;
        var firstDay = this.getfirstday(year,month),
            monthCount = this.getdaysinonemonth(year,month),
            preMonthCount = this.getdaysinonemonth(year,month-1 == 0? 12: month-1);
        var now = new Date(),
            nowYear = now.getFullYear(),
            nowMonth = now.getMonth()+1,
            nowDay = now.getDate();
        var day = 1;
        var start = false;
        var html =[];
        for(var i = 1; i < 7; i++){
            var td = [];
            if (i == 1 && firstDay!=7){
                for(var k = firstDay-1; k >= 0; k--){
                    td.unshift(<td key={k} className='calendar-cell calendar-last-month-cell' onClick={this.selected.bind(this,year,month,preMonthCount,"prev")}><div className='calendar-date'>{preMonthCount}</div></td>);
                    preMonthCount--;
                }
            }
            for (var j = 0; j < 7; j++){
                if (i == 1 && !start){
                    if ((firstDay == 7 && j == 0) || firstDay == j){
                        let style = "calendar-cell ";
                        if(day==nowDay && month == nowMonth && year==nowYear) {
                            style += "calendar-today ";
                        }
                        if(day==selectedDay && month == selectedMonth && year==selectedYear){
                            style += "calendar-selected-day "
                        }
                        td.push(<td key={j} className={style} onClick={this.selected.bind(this,year,month,day,"this")}><div className='calendar-date'>{day}</div></td>);
                        day ++;
                        start = true;
                    }
                } else if (start && day <= monthCount){
                    let style = "calendar-cell ";
                    if(day==nowDay && month == nowMonth && year==nowYear) {
                        style += "calendar-today ";
                    }
                    if(day==selectedDay && month == selectedMonth && year==selectedYear){
                        style += "calendar-selected-day "
                    }
                    td.push(<td key={j} className={style} onClick={this.selected.bind(this,year,month,day,"this")}><div className='calendar-date'>{day}</div></td>);
                    day ++;
                } else if (start && day > monthCount){
                    td.push(<td key={j} className='calendar-cell calendar-last-month-cell' onClick={this.selected.bind(this,year,month,day-monthCount,"next")}><div className='calendar-date'>{day-monthCount}</div></td>);
                    day ++;
                }
            }
            html.push(<tr>
                {td}
            </tr>)
        }
        return html;
    }

    getDataTable() {
        var {showYear,showMonth} = this.state;
        var thead = [];
        thead.push(
        <thead>
            <tr>
                <th className='calendar-column-header'> <span className='calendar-column-header-inner'>日</span></th>
                <th className='calendar-column-header'> <span className='calendar-column-header-inner'>一</span></th>
                <th className='calendar-column-header'> <span className='calendar-column-header-inner'>二</span></th>
                <th className='calendar-column-header'> <span className='calendar-column-header-inner'>三</span></th>
                <th className='calendar-column-header'> <span className='calendar-column-header-inner'>四</span></th>
                <th className='calendar-column-header'> <span className='calendar-column-header-inner'>五</span></th>
                <th className='calendar-column-header'> <span className='calendar-column-header-inner'>六</span></th>
            </tr>
        </thead>
        );
        return (
            <div className='calendar-picker-panel'>
                <div className='calendar-picker-date-panel'>
                    <div className='calendar-hearder'>
                        <a className='calendar-prev-year-btn' onClick={this.dateChange.bind(this,"year","prev")}></a>
                        <a className='calendar-prev-month-btn' onClick={this.dateChange.bind(this,"month","prev")}></a>
                        <span className='calendar-my-select'>
                                <a className='calendar-year-select txt-link'>{showYear}年</a>
                                <a className='calendar-month-select txt-link'>{showMonth}月</a>
                            </span>
                        <a className='calendar-next-month-btn' onClick={this.dateChange.bind(this,"month","next")}></a>
                        <a className='calendar-next-year-btn' onClick={this.dateChange.bind(this,"year","next")}></a>
                    </div>
                    <div className='calendar-body'>
                        <table className='calendar-table'>
                            {thead}
                            <tbody className='calendar-tbody'>
                            {this.datePut(showYear,showMonth)}
                            </tbody>
                        </table>
                    </div>
                    <div className='calendar-footer'>
                        <a className='calendar-today-btn txt-link' onClick={this.today.bind(this)}>今天</a>
                    </div>
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

    selected(year,month,day,type){
        var selectedYear,selectedMonth,selectedDay;
        if(type=="this"){
            selectedYear = year;
            selectedMonth = month;
            selectedDay = day;
        }else if(type=="prev"){
            selectedYear = month==1?year-1:year;
            selectedMonth = month==1?12:month-1;
            selectedDay = day;
        } else if(type=="next"){
            selectedYear = month==12?year+1:year;
            selectedMonth = month==12?1:month+1;
            selectedDay = day;
        }
        this.setState({
            selectedYear: selectedYear,
            selectedMonth: selectedMonth,
            selectedDay: selectedDay,
            showYear: selectedYear,
            showMonth: selectedMonth
        });
        document.getElementById("picker-input").value =selectedYear + "/" + selectedMonth + "/" + selectedDay;
        this.show();
    }

    deleteTime(){
        this.setState({
            selectedYear: 0,
            selectedMonth: 0,
            selectedDay: 0
        });
        document.getElementById("picker-input").val("");
        this.show();
    }

    dateChange(type,direction){
        var {showYear,showMonth} = this.state;

        var year,month;
        if(type == 'year' && direction == 'prev'){
            year = showYear-1;
            month = showMonth;
        } else if(type == 'year' && direction == 'next'){
            year = showYear + 1;
            month = showMonth;
        } else if(type == 'month' && direction == 'prev'){
            year = showMonth==1? showYear - 1: showYear;
            month = showMonth==1? 12: showMonth -1;
        } else if(type == 'month' && direction == 'next'){
            year = showMonth==12? showYear + 1: showYear;
            month = showMonth==12? 1: showMonth + 1;
        }
        this.setState({
            showYear: year,
            showMonth: month
        });
    }

    today(){
        var now = new Date(),
            nowYear = now.getFullYear(),
            nowMonth = now.getMonth()+1,
            nowDay = now.getDate();
        this.setState({
            showYear: nowYear,
            showMonth: nowMonth,
            showDay: nowDay,
            selectedDay: nowDay,
            selectedMonth: nowMonth,
            selectedYear: nowYear
        });
        document.getElementById("picker-input").value =nowYear + "/" + nowMonth + "/" + nowDay;
    }

    inputDate(){
        var valve = document.getElementById("picker-input").value;
        var dates = valve.split("/");
        if (dates.length != 3){
            return ;
        }
        this.setState({
            selectedYear: dates[0],
            selectedMonth: dates[1],
            selectedDay: dates[2],
            showYear: dates[0],
            showMonth: dates[1]
        })
    }

    render() {
        var {isShowPicker} = this.state;
        var style = isShowPicker?"calendar-picker  calendar-picker-action calendar-single-picker":"calendar-picker  calendar-single-picker";
        return (
            <div className={style}>
                <div className="calendar-picker-input-wrapper"  onClick={this.show.bind(this)}>
                    <input type="input" name="" className="calendar-picker-input" id="picker-input" placeholder="请选择日期" onKeyUp={this.inputDate.bind(this)}/>
                    <span className="icon-calendar-picker" onClick={this.deleteTime.bind(this)}></span>
                </div>
                {this.getDataTable()}
            </div>
        );
    }
}