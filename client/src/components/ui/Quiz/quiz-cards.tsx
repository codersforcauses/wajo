import { BellRing } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DateTimeDisplay from "@/components/ui/date-format";
import { cn } from "@/lib/utils";
import { CompetitionResponse, QuizResponse } from "@/types/quiz";

type CardProps = React.ComponentProps<typeof Card>;
export function NoCompetitionCard({ className, ...props }: CardProps) {
  return (
    <>
      <Card {...props} className={cn(className)}>
        <CardHeader>
          <CardTitle>No Competition</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            There is no competition at the moment. Please check back later.
          </CardDescription>
        </CardContent>
      </Card>
    </>
  );
}

type CompetitionCardProps = CompetitionResponse & { className?: string };
export function CompetitionCard({ ...props }: CompetitionCardProps) {
  const router = useRouter();
  const { results } = props;
  const competition = results[0];
  return (
    <Card className={cn(props.className)}>
      <CardHeader>
        <CardTitle>{competition.name}</CardTitle>
        <CardDescription className="text-md">
          {competition.intro}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-8 rounded-md border p-4">
          <BellRing />
          <div className="flex-1 space-y-1">
            <p className="text-md pl-0.5 text-muted-foreground">Start at :</p>
            <div className="text-sm font-medium leading-none">
              <DateTimeDisplay
                className="text-lg font-bold"
                date={competition.open_time_date}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          className="w-full"
          href={`${router.pathname}/competition/${competition.id}`}
        >
          <Button className="w-full" variant="secondary" size="default">
            Start {competition.name}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

type PracticeCardProps = QuizResponse & { className?: string };

export function PracticeCard({ className, ...props }: PracticeCardProps) {
  const { results } = props;

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{"Practice Quizzes"}</CardTitle>
        <CardDescription> {results.length} quizzes in total</CardDescription>
      </CardHeader>

      <CardFooter>
        <Link className="w-full" href="/quiz/practice">
          <Button className="w-full" variant="secondary" size="default">
            Go to Practice
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
