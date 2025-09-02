"use client";
import { useMemo, useState } from "react";
import { solveAssignmentWithSteps, Step } from "@/lib/hungarian";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const namesRows = ["A", "B", "C", "D", "E"];
const namesCols = ["Task 1", "Task 2", "Task 3", "Task 4"];

const input = [
  [19, 24, 29, 25],
  [17, 27, 30, 29],
  [19, 28, 31, 28],
  [20, 12, 28, 29],
  [20, 25, 31, 26],
];

export default function AssignmentDemo() {
  const result = useMemo(() => solveAssignmentWithSteps(input), []);
  const [idx, setIdx] = useState(0);
  const step: Step = result.steps[idx];

  const size = step.matrix.length;
  const colNames = [
    ...namesCols,
    ...Array(Math.max(0, size - namesCols.length)).fill("Dummy"),
  ].slice(0, size);
  const rowNames = [
    ...namesRows,
    ...Array(Math.max(0, size - namesRows.length)).fill("Dummy"),
  ].slice(0, size);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Assignment Problem — Step by Step</h1>

      {/* Step info */}
      <Card>
        <CardHeader>
          <CardTitle>{step.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-600">{step.description}</p>

          {/* Matrix Table */}
          <div className="overflow-x-auto">
            <table className="border-collapse border border-gray-300 text-center">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-2 py-1"></th>
                  {colNames.map((c, j) => (
                    <th key={j} className="border border-gray-300 px-3 py-1">
                      {c}
                      {step.coveredCols?.[j] && (
                        <span className="ml-1 text-xs bg-blue-200 px-1 rounded">
                          Covered
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {step.matrix.map((row, r) => (
                  <tr
                    key={r}
                    className={cn(
                      step.coveredRows?.[r] && "line-through opacity-60"
                    )}
                  >
                    <td className="border border-gray-300 px-2 py-1 font-semibold">
                      {rowNames[r]}
                    </td>
                    {row.map((val, c) => {
                      const star = step.starred?.[r]?.[c];
                      const prime = step.primed?.[r]?.[c];
                      return (
                        <td
                          key={c}
                          className={cn(
                            "border border-gray-300 px-2 py-1",
                            step.coveredCols?.[c] && "bg-blue-50"
                          )}
                        >
                          {val === 0 && star ? (
                            <span className="font-bold text-green-700">
                              ★ {val}
                            </span>
                          ) : val === 0 && prime ? (
                            <span className="text-pink-600">′ {val}</span>
                          ) : (
                            val
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setIdx((i) => Math.max(0, i - 1))}
              disabled={idx === 0}
            >
              Prev
            </Button>
            <Button
              onClick={() =>
                setIdx((i) => Math.min(result.steps.length - 1, i + 1))
              }
              disabled={idx === result.steps.length - 1}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Final Result */}
      <Card>
        <CardHeader>
          <CardTitle>Optimal Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-5 space-y-1">
            {result.assignments.map(([r, c]) => {
              const isDummy = c >= namesCols.length || r >= namesRows.length;
              return (
                <li key={`${r}-${c}`}>
                  {isDummy
                    ? `${rowNames[r]} → (idle)`
                    : `${rowNames[r]} → ${colNames[c]}`}
                </li>
              );
            })}
          </ul>
          <Separator className="my-3" />
          <p className="font-semibold">Total Cost: ₹{result.totalCost}</p>
        </CardContent>
      </Card>
    </div>
  );
}
