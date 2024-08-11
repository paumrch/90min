import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function NextEvents() {
  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Next events</CardTitle>
          <CardDescription>
            Upcoming football matches and predictions.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="#">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Match</TableHead>
              <TableHead className="hidden xl:table-cell">Type</TableHead>
              <TableHead className="hidden xl:table-cell">Status</TableHead>
              <TableHead className="hidden xl:table-cell">Date</TableHead>
              <TableHead>Odds</TableHead>
              <TableHead className="text-right">Prediction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="font-medium">Valencia vs Barcelona</div>
                <div className="text-sm text-muted-foreground">
                  20:00h. La Liga
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-cell">League</TableCell>
              <TableCell className="hidden xl:table-cell">
                <Badge className="text-xs" variant="outline">
                  Upcoming
                </Badge>
              </TableCell>
              <TableCell className="hidden xl:table-cell">2024-08-15</TableCell>
              <TableCell>1.80€</TableCell>
              <TableCell className="text-right">
                <Badge variant="secondary" className="whitespace-nowrap">
                  Over 2.5
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Real Madrid vs Atlético Madrid</div>
                <div className="text-sm text-muted-foreground">
                  21:30h. La Liga
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-cell">League</TableCell>
              <TableCell className="hidden xl:table-cell">
                <Badge className="text-xs" variant="outline">
                  Upcoming
                </Badge>
              </TableCell>
              <TableCell className="hidden xl:table-cell">2024-08-16</TableCell>
              <TableCell>2.10€</TableCell>
              <TableCell className="text-right">
                <Badge variant="secondary" className="whitespace-nowrap">
                  Under 2.5
                </Badge>
              </TableCell>
            </TableRow>
            {/* Puedes añadir más filas aquí */}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}