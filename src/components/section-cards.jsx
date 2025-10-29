import { IconTrendingDown, IconTrendingUp, IconDollarSign, IconUsers, IconActivity, IconBarChart3 } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card group hover:scale-[1.02] transition-all duration-300 animate-slide-up">
        <CardHeader className="relative">
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
            <IconDollarSign className="w-6 h-6 text-green-600" />
          </div>
          <CardDescription className="text-muted-foreground font-medium">Total Revenue</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent @[250px]/card:text-4xl">
            $1,250.00
          </CardTitle>
          <CardAction>
            <Badge variant="success" className="gap-1">
              <IconTrendingUp className="w-3 h-3" />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 text-sm pt-0">
          <div className="flex items-center gap-2 font-medium text-green-600">
            <IconTrendingUp className="size-4" />
            Trending up this month
          </div>
          <div className="text-muted-foreground text-xs">
            Revenue growth exceeds targets
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card group hover:scale-[1.02] transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="relative">
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
            <IconUsers className="w-6 h-6 text-blue-600" />
          </div>
          <CardDescription className="text-muted-foreground font-medium">New Customers</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent @[250px]/card:text-4xl">
            1,234
          </CardTitle>
          <CardAction>
            <Badge variant="warning" className="gap-1">
              <IconTrendingDown className="w-3 h-3" />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 text-sm pt-0">
          <div className="flex items-center gap-2 font-medium text-orange-600">
            <IconTrendingDown className="size-4" />
            Down 20% this period
          </div>
          <div className="text-muted-foreground text-xs">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card group hover:scale-[1.02] transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="relative">
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
            <IconActivity className="w-6 h-6 text-purple-600" />
          </div>
          <CardDescription className="text-muted-foreground font-medium">Active Accounts</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent @[250px]/card:text-4xl">
            45,678
          </CardTitle>
          <CardAction>
            <Badge variant="success" className="gap-1">
              <IconTrendingUp className="w-3 h-3" />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 text-sm pt-0">
          <div className="flex items-center gap-2 font-medium text-green-600">
            <IconTrendingUp className="size-4" />
            Strong user retention
          </div>
          <div className="text-muted-foreground text-xs">
            Engagement exceeds targets
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card group hover:scale-[1.02] transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <CardHeader className="relative">
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-earth-brown/20 flex items-center justify-center">
            <IconBarChart3 className="w-6 h-6 text-primary" />
          </div>
          <CardDescription className="text-muted-foreground font-medium">Growth Rate</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums bg-gradient-to-r from-primary to-earth-brown bg-clip-text text-transparent @[250px]/card:text-4xl">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="success" className="gap-1">
              <IconTrendingUp className="w-3 h-3" />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 text-sm pt-0">
          <div className="flex items-center gap-2 font-medium text-green-600">
            <IconTrendingUp className="size-4" />
            Steady performance increase
          </div>
          <div className="text-muted-foreground text-xs">
            Meets growth projections
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
