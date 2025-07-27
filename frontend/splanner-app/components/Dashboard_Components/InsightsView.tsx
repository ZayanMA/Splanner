import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Task } from "@/types/task";

type InsightsViewProps = {
  tasks: Task[];
};

const COLORS = ["#00C49F", "#FF8042", "#FFBB28", "#8884d8", "#0088FE"];

const InsightsView: React.FC<InsightsViewProps> = ({ tasks }) => {
  const pieData = [
    { name: "Completed", value: tasks.filter((t) => t.completed).length },
    { name: "Pending", value: tasks.filter((t) => !t.completed).length },
  ];

  return (
    <div className="w-full h-[400px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InsightsView;
