import { Utils } from "../Utils.ts";
import {
  ColorStep,
  CommitDate,
  CommitDateWithIntensity,
} from "../../services/GithubService.ts";

export class ContributionsProcessor {
  private years = [2023, 2024, 2025];
  private months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  private days = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ];

  public calculateDateIntensity(
    dates: CommitDate[],
  ): CommitDateWithIntensity[] {
    let groupedDates = dates.reduce(
      (acc, date) => {
        const key = `${date.day}-${date.month}-${date.year}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(date);
        return acc;
      },
      {} as Record<string, CommitDate[]>,
    );

    groupedDates = this.addMissingDaysToMonth(groupedDates);

    const frequencies = Object.values(groupedDates).map(
      (group) => group.length,
    );

    const minFreq: number = Math.min(...frequencies);
    const maxFreq: number = Math.max(...frequencies);

    const intensitySteps: ColorStep[] = [
      0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
    ];

    return Object.entries(groupedDates).map(
      (value: [string, CommitDate[]], index: number) => {
        let intensity: ColorStep;
        const frequency: number = frequencies[index];

        if (minFreq === maxFreq) {
          intensity = 500;
        } else {
          const normalized =
            ((frequency - minFreq) / (maxFreq - minFreq) + 0.09) * 1.3;

          const stepIndex = Math.round(
            normalized * (intensitySteps.length + 1),
          );

          intensity = intensitySteps[stepIndex];
        }

        return {
          id: 0,
          day: value[1][0].day,
          month: value[1][0].month,
          year: value[1][0].year,
          intensity,
        };
      },
    );
  }

  private addMissingDaysToMonth(
    dates: Record<string, CommitDate[]>,
  ): Record<string, CommitDate[]> {
    const keys = Object.keys(dates);
    const negativeGroupedDates: number[][][] = [];
    const smallMonths: number[] = [4, 6, 9, 11];

    const groupedDates: number[][][] = keys.reduce(
      (acc: number[][][], key: string) => {
        this.years.forEach((year: number) => {
          this.months.forEach((month: number) => {
            this.days.forEach((day: number) => {
              const keyDay: number | null = Utils.explodeDateKey(key).day;
              const keyMonth: number | null = Utils.explodeDateKey(key).month;
              const keyYear: number | null = Utils.explodeDateKey(key).year;

              if (keyYear === year && keyMonth === month && keyDay === day) {
                if (!acc[year] && keyYear) acc[year] = [];
                if (!acc[year][month] && keyMonth) acc[year][month] = [];
                if (keyDay === day) acc[year][month].push(day);
              }
            });
          });
        });
        return acc;
      },
      [] as number[][][],
    );

    groupedDates.forEach((dateMonths: number[][], dateYear: number) => {
      dateMonths.forEach((dateDays: number[], dateMonth: number) => {
        dateDays.forEach((dateDay: number) => {
          this.years.forEach((year: number) => {
            this.months.forEach((month: number) => {
              this.days.forEach((day: number) => {
                if (
                  dateMonth === month &&
                  dateYear === year &&
                  day !== dateDay
                ) {
                  if (!dateDays.includes(day)) {
                    if (!negativeGroupedDates[year])
                      negativeGroupedDates[year] = [];
                    if (!negativeGroupedDates[year][month])
                      negativeGroupedDates[year][month] = [];
                    if (!negativeGroupedDates[year][month].includes(day)) {
                      if (smallMonths.includes(month) && day === 31) return;
                      if (month === 2 && [30, 31].includes(day)) return;
                      negativeGroupedDates[year][month].push(day);
                    }
                  }
                }
              });
            });
          });
        });
      });
    });

    negativeGroupedDates.forEach((dateMonths: number[][], dateYear: number) => {
      dateMonths.forEach((dateDays: number[], dateMonth: number) => {
        dateDays.forEach((dateDay: number) => {
          const key = `${dateDay}-${dateMonth}-${dateYear}`;
          const originalDateKeys = Object.keys(dates);

          if (!originalDateKeys.includes(key)) {
            dates[key] = [
              {
                id: 0,
                day: dateDay,
                month: dateMonth,
                year: dateYear,
              },
            ];
          }
        });
      });
    });
    return dates;
  }

  public sortDates(
    dates: CommitDateWithIntensity[],
  ): CommitDateWithIntensity[] {
    dates = dates.sort(
      (a: CommitDateWithIntensity, b: CommitDateWithIntensity) => {
        return a.day - b.day;
      },
    );
    dates = dates.sort(
      (a: CommitDateWithIntensity, b: CommitDateWithIntensity) => {
        return a.month - b.month;
      },
    );
    dates = dates.sort(
      (a: CommitDateWithIntensity, b: CommitDateWithIntensity) => {
        return a.year - b.year;
      },
    );

    dates.forEach((date: CommitDateWithIntensity, index: number) => {
      date.id = index;
    });
    return dates;
  }

  public getCommitDate(commit): CommitDate {
    const date: Date = new Date(commit.commit.committer.date);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return { day, month, year };
  }

  public getEventDate(event): CommitDate {
    const date: Date = new Date(event.created_at);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return { day, month, year };
  }
}
