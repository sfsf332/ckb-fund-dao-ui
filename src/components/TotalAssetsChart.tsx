"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";

type TotalAssetsChartProps = {
  height?: number;
  // 单位：亿（Billion）
  data?: number[];
  yearLabel?: string;
};

export default function TotalAssetsChart({
  height = 300,
  data = [3.4, 0.8, 1.6, 1.0, 2.0, 0.5, 2.8, 0.7, 2.8, 2.6, 4.8, 2.1],
  yearLabel = "2025",
}: TotalAssetsChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.EChartsType | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = echarts.init(containerRef.current);
    chartRef.current = chart;

    const option: echarts.EChartsOption = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "line" },
        confine: true,
        className: "chart-tooltip-dark",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          const p = Array.isArray(params) ? params[0] : params;
          return `${p.axisValue}<br/>${p.value}B`;
        },
      },
      grid: { left: 40, right: 20, top: 20, bottom: 40 },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月",
        ],
        axisLine: { lineStyle: { color: "#4C525C" } },
        axisLabel: { color: "#9AA3AF" },
        splitLine: { show: false },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 5,
        interval: 1,
        axisLabel: {
          color: "#9AA3AF",
          formatter: (v: number) => `${v}B`,
        },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: "#3A3F49", type: "dashed" } },
      },
      legend: {
        bottom: 6,
        textStyle: { color: "#9AA3AF" },
        data: [yearLabel],
        itemHeight: 8,
        itemWidth: 12,
        icon: "circle",
      },
      series: [
        {
          name: yearLabel,
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: { color: "#00CC9B", width: 2 },
          itemStyle: { color: "#00CC9B", borderColor: "#0b1a16" },
          emphasis: {
            focus: "series",
            itemStyle: { shadowBlur: 8, shadowColor: "rgba(0, 204, 155, 0.5)" },
          },
          data,
        },
      ],
    };

    chart.setOption(option);

    const resize = () => chart.resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      chart.dispose();
      chartRef.current = null;
    };
  }, [data, yearLabel]);

  return (
    <div
      className="assets_chart"
      ref={containerRef}
      style={{ width: "100%", height }}
      aria-label="total-assets-line-chart"
    />
  );
}


