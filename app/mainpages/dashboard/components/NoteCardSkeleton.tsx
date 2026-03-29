"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface NoteCardSkeletonProps {
  compact?: boolean;
}

const NoteCardSkeleton = ({ compact = false }: NoteCardSkeletonProps) => {
  return (
    <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className={compact ? "p-2.5" : "p-3"}>
        <div className="space-y-2">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="min-w-0 mr-2 flex-1 space-y-1.5">
              <Skeleton className="h-4 w-3/4" />
              {!compact && <Skeleton className="h-3 w-1/2" />}
            </div>
            <Skeleton className="h-7 w-7 rounded-full shrink-0" />
          </div>

          {/* Badge */}
          {!compact && <Skeleton className="h-5 w-20 rounded-full" />}

          {/* Footer */}
          <div
            className={`flex items-center justify-between ${
              compact ? "mt-1.5 pt-1.5" : "mt-3 pt-2"
            } border-t border-border/50`}
          >
            <Skeleton className="h-3 w-16" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-3 w-10" />
              {!compact && <Skeleton className="h-3 w-14" />}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCardSkeleton;
