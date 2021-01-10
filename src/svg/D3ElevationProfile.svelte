<script>
    import { onMount } from 'svelte';
    import { select as d3_select, pointer } from 'd3-selection';
    import { scaleLinear } from 'd3-scale';
    import { line as d3_line, curveCardinal } from 'd3-shape';
    import { axisBottom, axisLeft } from 'd3-axis';
    import { bisector } from 'd3-array' ;
    import { set_elevation_point, unset_elevation_point } from '../map/LayerElevation.svelte';

    export let data;
    export let width;
    export let height;
    export let x_axis_width = 20;
    export let y_axis_width = 40;
    export let margin = 5;

    let component;

    onMount(() => {
        let w = component.clientWidth;
        let h = component.clientHeight;
        let svg = d3_select(component)
            .attr("viewbox", '0 0 ' + w + ' ' + h)
            .on("mousemove touchmove", hoverEle)
            .on("mouseleave", () => {
                unset_elevation_point();
                rule.attr("opacity", 0);
            });

        const x_scale = scaleLinear()
            .domain([0, data.end_position])
            .range([y_axis_width, w - margin]);

        const y_scale = scaleLinear()
            .domain([data.min_elevation, data.max_elevation]).nice()
            .range([h - x_axis_width, margin]);

        const line = d3_line()
            .curve(curveCardinal.tension(0.5))
            .x(d => x_scale(d.pos))
            .y(d => y_scale(d.ele));

        const rule = svg.append("g")
            .append("line")
            .attr("y1", h)
            .attr("y2", 0)
            .attr("stroke", "red")
            .attr("opacity", 0);

        svg.append("g")
            .attr("transform", `translate(0, ${h - x_axis_width})`)
            .call(axisBottom(scaleLinear()
                                 .domain([0, data.end_position / 1000])
                                 .range([y_axis_width, w - margin]))
                      .ticks(w / 100));

        svg.append("g")
            .attr("transform", `translate(0, ${h - x_axis_width})`)
            .attr("stroke", "lightgray")
            .attr("stroke-width", 0.2)
            .call(axisBottom(x_scale)
                      .ticks(w / 100)
                      .tickSize(-(h - margin - x_axis_width))
                      .tickFormat(''));

        svg.append("g")
            .attr("transform", `translate(${y_axis_width}, 0)`)
            .call(axisLeft(y_scale).ticks(h / 50, '.2~f'));

        svg.append("g")
            .attr("transform", `translate(${y_axis_width}, 0)`)
            .attr("stroke", "lightgray")
            .attr("stroke-width", 0.2)
            .call(axisLeft(y_scale)
                      .ticks(h / 50)
                      .tickSize(-(w - margin - y_axis_width))
                      .tickFormat(''));

        svg.append("g")
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 3)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
        .selectAll("path")
        .data(data.segments)
        .join("path")
            .style("mix-blend-mode", "multiply")
            .attr("d", d => line(d.elevation));

        const dataBisect = bisector(d => d.pos).center;

        function hoverEle (event) {
            const x = x_scale.invert(pointer(event, this)[0]);
            rule.attr("transform", `translate(${x_scale(x) + 0.5},0)`);
            rule.attr("opacity", 1.0);
            let found = false;
            for (const segment of data.segments) {
                if (x < segment.elevation[0].pos ||
                    x > segment.elevation[segment.elevation.length - 1].pos) {
                    continue;
                }

                let i = dataBisect(segment.elevation, x);
                if (i != null) {
                    set_elevation_point(segment.elevation[i].x, segment.elevation[i].y);
                    found = true;
                    break;
                }
            }
            if (!found) {
                unset_elevation_point();
            }
        }

    });

</script>

<svg bind:this={component} preserveAspectRatio="none" width={width} height={height}></svg>
