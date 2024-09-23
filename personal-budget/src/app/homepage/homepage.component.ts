import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3'
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import { Arc } from 'd3-shape';
import { DataService, IBudget } from '../data.service';
import { Data } from '@angular/router';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
  // providers: []
})
export class HomepageComponent implements OnInit, AfterViewInit{

  backgroundColor: String[] = [
    '#ffcd56',
    '#ff6384',
    '#36a2eb',
    '#fd6b19',
    '#ffe633',
    '#74ff33',
    '#da33ff'

]


  constructor(private http: HttpClient, private dataService: DataService){ }
  ngAfterViewInit(): void {
    this.dataService.getMyBudgetData()
    this.createChart(this.dataService.myBudget);
    this.createDonutChart(this.dataService.myBudget);
  }

  ngOnInit(): void {

  }


createChart(myBudget: IBudget[]) {
  let dataSource: any = {
    datasets: [
        {
            data: [String],
            backgroundColor: [String],
        }
    ],
    labels: [String]
};
  dataSource['datasets'][0].data = myBudget?.map(obj => obj.value);
  dataSource['datasets'][0].backgroundColor = this.backgroundColor;
  dataSource['labels'] = myBudget?.map(obj => obj.title);
  var ctx = <HTMLCanvasElement> document?.getElementById('myChart') ;
    var myPieChart = new Chart(ctx, {
      type: 'pie',
      data: dataSource,
  });
}

createDonutChart(myDonutData: any) {

  var width = 400;
  var height = 400;
  var margin = 40
  var radius = Math.min(width, height) / 2 - margin;
  var donutWidth = 75;
  var color = d3.scaleOrdinal()
      .range(this.backgroundColor);

  var svg: any= d3.select('#myDonutChart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) +
          ',' + (height / 2) + ')');

  var arc : Arc<any, d3Shape.DefaultArcObject> = d3.arc()
      .outerRadius(radius)
      .innerRadius(radius- donutWidth)
      .cornerRadius(3)
      .padAngle(0.015);

  var outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9)

  var pie = d3.pie()
      .value(function (d:any) {
          return d.value;
      })
      .sort(null);

  var data_points = pie(myDonutData)

  var path = svg.selectAll('path')
      .data(data_points)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function (d:any, i:any) {
          return color(d.data.title);
      })
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .attr('transform', 'translate(0, 0)')

  var allPolylines = svg.selectAll('allPolylines')
      .data(data_points)
      .enter()
      .append('polyline')
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr('points', function (d:any) {
          var posA = arc.centroid(d) // line insertion in the slice
          var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
          var posC = outerArc.centroid(d); // Label position = almost the same as posB
          var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
          posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
          return [posA, posB, posC]
      })

  var labels = svg
      .selectAll('allLabels')
      .data(data_points)
      .enter()
      .append('text')
      .text(function (d:any) { return d.data.title })
      .attr('transform', function (d:any) {
          var pos = outerArc.centroid(d);
          var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
          pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
          return 'translate(' + pos + ')';
      })
      .style('text-anchor', function (d:any) {
          var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
          return (midangle < Math.PI ? 'start' : 'end')
      })

}


}
