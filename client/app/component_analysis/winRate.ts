import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms';

@Component({
    selector: 'winRater',
    templateUrl: '../client/app/component_analysis/winRate.html',
    styleUrls: ['../client/app/component_analysis/winRate.css'],
})


export class WinRaterComponent implements OnInit {
    public chartType: string = 'line';

    public chartData: Array<any> = [];

    public chartLabels: Array<any> = [];

    public chartColors: Array<any> = [
        {
            backgroundColor: 'rgba(207, 161, 32, 0.3)',
            borderColor: 'rgba(207, 67, 32, .7)',
            borderWidth: 2,
            pointBackgroundColor: '#fff',
            pointBorderColor: 'rgba(207, 67, 32, .7)',
        },
        {
            backgroundColor: 'rgba(0, 94, 137, 0.3)',
            borderColor: 'rgba(38, 24, 114, 0.7)',
            borderWidth: 2,
            pointBackgroundColor: '#fff',
            pointBorderColor: 'rgba(38, 24, 114, .7)',
        }
    ];

    public lineChartLegend = true;

    public chartOptions: any = {
        responsive: true
    };

    public chartClicked(e: any): void { }

    public chartHovered(e: any): void { }


    names = [
        'Greedy',
        'Alpha-Beta Pruning',
        'Alpha-Beta Pruning with Move Reorder',
        'Temporal Difference Learning',
        'Temporal Difference Learning (Trained)',
        'Monte Carlo Tree Search',
        'Ultimate (Combined Strategy)'
    ]


    teamControl: FormControl = new FormControl();
    N = 10;
    public team = 1;
    data;
    agent_param;
    ngOnInit() {
    }


    swithTeam() {
        this.team *= -1;
        this.update(this.data, this.agent_param);
    }


    update(r, agent_param) {
        if (r.length == 0) {
            this.chartData = [];
            return;
        }

        this.data = r;
        this.agent_param = agent_param;
        r = this.team_results(r);
        var x = r.filter(x => x != 0);
        // console.log("result: ", x)

        // no draw
        var w_ratio = this.process_results_ave(x);
        // console.log("w_ratio: ",w_ratio)

        // include draw
        var wd_ratio = this.process_results_ave(r);

        this.chartData[0] = { data: w_ratio, label: "Winning Rate" };
        this.chartData[1] = { data: wd_ratio, label: "Winning (included draw) Rate" };

        var n = w_ratio.length;
        var interval: number = Math.ceil(x.length / this.N);

        // labels
        this.chartLabels = [];
        for (var i = 0; i < n; i += 1) {
            this.chartLabels.push("Game " + (i * interval + 1));
        }
    }

    // results: [1|0|-1]
    // return: [win rate]
    process_results_ave(results) {
        var rate = [];
        var interval: number = Math.ceil(results.length / this.N);
        // console.log("interval ave:", interval);
        for (var i = 0; i < results.length; i += interval) {
            var period = results.slice(0, i + interval);
            // console.log("p ave: ",period);
            var wins = period.filter(x => x >= 0);
            // console.log("r ave: ", wins);
            rate.push(wins.length / period.length);
        }
        return rate;
    }


    team_results(arr) {
        if (this.team == 1) return arr;
        return arr.map(x => x *= -1);
    }


    get_plot_title() {
        var red = "You ";

        if (this.agent_param[0] == 2)
            var black = this.names[this.agent_param[0]] + "-Simulation " + this.agent_param[1] + "000";
        else var black = this.names[this.agent_param[0]] + "-Depth " + this.agent_param[1];
        var first = this.team == 1 ? red : black;
        var second = this.team == 1 ? black : red;
        return first + "( vs " + second + " )" + " Win Rate";
    }

}
