"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PresaleWithKey } from "@/hooks/useLaunchpad";
import {
  calculateProgress,
  formatTimeRemaining,
  getPresaleStatus,
  lamportsToSol,
} from "@/lib/anchor/launchpad";
import { Clock, Target, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

interface PresaleCardProps {
  presale: PresaleWithKey;
}

export function PresaleCard({ presale }: PresaleCardProps) {
  const status = getPresaleStatus(presale);
  const progress = calculateProgress(presale.totalRaised, presale.hardCap);
  const timeRemaining = formatTimeRemaining(presale.endTime);

  const statusColors = {
    upcoming: "bg-blue-500",
    active: "bg-green-500",
    ended: "bg-orange-500",
    finalized: "bg-gray-500",
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">Token Presale</h3>
            <p className="text-sm text-muted-foreground">
              {presale.tokenMint.toBase58().slice(0, 8)}...
            </p>
          </div>
          <Badge className={statusColors[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{lamportsToSol(presale.totalRaised).toFixed(2)} SOL</span>
            <span>{lamportsToSol(presale.hardCap).toFixed(2)} SOL</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
            <Target className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Soft Cap</p>
              <p className="text-sm font-semibold">
                {lamportsToSol(presale.softCap).toFixed(2)} SOL
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
            <Clock className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Time Left</p>
              <p className="text-sm font-semibold">{timeRemaining}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
            <TrendingUp className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Token Price</p>
              <p className="text-sm font-semibold">
                {presale.tokenPrice} per SOL
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
            <Users className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Min/Max</p>
              <p className="text-sm font-semibold">
                {lamportsToSol(presale.minContribution)}-
                {lamportsToSol(presale.maxContribution)} SOL
              </p>
            </div>
          </div>
        </div>

        {presale.vestingEnabled && (
          <Badge variant="outline" className="w-full justify-center">
            Vesting: {presale.vestingDuration / 86400} days
          </Badge>
        )}
      </CardContent>

      <CardFooter>
        <Link href={`/launchpad/${presale.publicKey.toBase58()}`} className="w-full">
          <Button className="w-full" disabled={status === "finalized"}>
            {status === "active"
              ? "Contribute Now"
              : status === "upcoming"
              ? "View Details"
              : status === "ended"
              ? "Claim Tokens"
              : "Finalized"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
