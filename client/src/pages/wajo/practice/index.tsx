import Link from "next/link";
import React from "react";

import { PublicPage } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function PracticePage() {
  return (
    <PublicPage>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Past Questions and Solutions
          </h1>
          <p className="text-gray-600">
            Choose a practice quiz to start practicing. No login required!
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card key={1} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Math</CardTitle>
              <CardDescription className="text-sm">
                This is a practice quiz for Math.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Marks: 100</span>
                <span>Time Limit: 10 min</span>
              </div>
              <Link
                href={`/wajo/practice-questions?quizId=1`}
                className="w-full"
              >
                <Button className="w-full" variant="default">
                  Start Practice
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card key={1} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Math</CardTitle>
              <CardDescription className="text-sm">
                This is a practice quiz for Math.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Marks: 100</span>
                <span>Time Limit: 10 min</span>
              </div>
              <Link
                href={`/wajo/practice-questions?quizId=1`}
                className="w-full"
              >
                <Button className="w-full" variant="default">
                  Start Practice
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card key={1} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Math</CardTitle>
              <CardDescription className="text-sm">
                This is a practice quiz for Math.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Marks: 100</span>
                <span>Time Limit: 10 min</span>
              </div>
              <Link
                href={`/wajo/practice-questions?quizId=1`}
                className="w-full"
              >
                <Button className="w-full" variant="default">
                  Start Practice
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card key={1} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Math</CardTitle>
              <CardDescription className="text-sm">
                This is a practice quiz for Math.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Marks: 100</span>
                <span>Time Limit: 10 min</span>
              </div>
              <Link
                href={`/wajo/practice-questions?quizId=1`}
                className="w-full"
              >
                <Button className="w-full" variant="default">
                  Start Practice
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card key={1} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Math</CardTitle>
              <CardDescription className="text-sm">
                This is a practice quiz for Math.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Marks: 100</span>
                <span>Time Limit: 10 min</span>
              </div>
              <Link
                href={`/wajo/practice-questions?quizId=1`}
                className="w-full"
              >
                <Button className="w-full" variant="default">
                  Start Practice
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicPage>
  );
}

export default PracticePage;
