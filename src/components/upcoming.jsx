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

export function Upcoming() {
  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Próximos eventos</CardTitle>
          <CardDescription>
            Próximos partidos de fútbol y predicciones.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="gap-1">
          <Link href="#">
            Ver todos
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Partido</TableHead>
              <TableHead className="hidden md:table-cell">Fecha y hora</TableHead>
              <TableHead>Cuota</TableHead>
              <TableHead className="text-right">Predicción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="font-medium">Valencia vs Barcelona</div>
                <div className="text-sm text-muted-foreground md:hidden">
                  15/08/2024 20:00h
                </div>
                <div className="text-sm text-muted-foreground">
                  La Liga
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">15/08/2024 20:00h</TableCell>
              <TableCell>1.80€</TableCell>
              <TableCell className="text-right">
                <Badge variant="secondary" className="whitespace-nowrap text-xs">
                  Over 2.5
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Real Madrid vs Atlético Madrid</div>
                <div className="text-sm text-muted-foreground md:hidden">
                  16/08/2024 21:30h
                </div>
                <div className="text-sm text-muted-foreground">
                  La Liga
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">16/08/2024 21:30h</TableCell>
              <TableCell>2.10€</TableCell>
              <TableCell className="text-right">
                <Badge variant="secondary" className="whitespace-nowrap text-xs">
                  Under 2.5
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}