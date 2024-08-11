import Link from "next/link"
import { ArrowUpRight, CheckCircle2, XCircle } from "lucide-react"
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

export function LatestResults() {
  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Latest results</CardTitle>
          <CardDescription>
            Recent football matches and their outcomes.
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
              <TableHead className="w-[60%]">Match</TableHead>
              <TableHead className="text-right">Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="font-medium">Valencia vs Barcelona</div>
                <div className="text-xs text-muted-foreground">
                  Over 2.5 @ 1.80
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="font-medium flex items-center justify-end gap-2">
                  2 - 1
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Real Madrid vs Atlético Madrid</div>
                <div className="text-xs text-muted-foreground">
                  Over 2.5 @ 2.10
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="font-medium flex items-center justify-end gap-2">
                  1 - 0
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Sevilla vs Betis</div>
                <div className="text-xs text-muted-foreground">
                  Under 2.5 @ 1.95
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="font-medium flex items-center justify-end gap-2">
                  0 - 1
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}