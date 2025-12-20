"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { z } from "zod";
import { toast } from "sonner";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPencil,
  IconPlus,
  IconSearch,
  IconMail,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export const schema = z.object({
  _id: z.string(),
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  rolesHaving: z.array(z.string()),
  isActive: z.boolean(),
});

const DragHandle = ({ id }: { id: string }) => {
  const { attributes, listeners } = useSortable({ id });
  return (
    <Button
      variant="ghost"
      size="sm"
      {...attributes}
      {...listeners}
      className="h-8 w-8 p-0 hover:bg-orange-50 dark:hover:bg-orange-950/30"
    >
      <IconGripVertical className="h-4 w-4 text-orange-500" />
    </Button>
  );
};

const DraggableRow = ({ row }: { row: any }) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original._id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 0,
    position: "relative",
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn(
        "border-orange-200/30 transition-all hover:bg-orange-50/50 dark:hover:bg-orange-950/20",
        isDragging && "bg-orange-100 dark:bg-orange-950/30"
      )}
    >
      {row.getVisibleCells().map((cell: any) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
};

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original._id} />,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-semibold">
        Name
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-medium text-foreground">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.original.username}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        {row.original.email}
      </div>
    ),
  },
  {
    accessorKey: "rolesHaving",
    header: "Roles",
    cell: ({ row }) => {
      const [isEditing, setIsEditing] = React.useState(false);
      const [selectedRoles, setSelectedRoles] = React.useState<string[]>(
        row.original.rolesHaving
      );

      const roleOptions = [
        "admin",
        "community_admin",
        "community_member",
        "viewer",
      ];

      const roleColors: { [key: string]: string } = {
        admin: "bg-gradient-to-r from-red-500 to-red-600 text-white",
        community_admin:
          "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
        community_member:
          "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
        viewer: "bg-gradient-to-r from-slate-500 to-slate-600 text-white",
      };

      const handleSave = () => {
        row.original.rolesHaving = selectedRoles;
        toast.success("Roles updated successfully!");
        setIsEditing(false);
      };

      if (isEditing) {
        return (
          <Popover open={isEditing} onOpenChange={setIsEditing}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                Edit Roles
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4" align="end">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">
                    Assign Roles
                  </h4>
                  <div className="space-y-2">
                    {roleOptions.map((role) => {
                      const isSelected = selectedRoles.includes(role);
                      return (
                        <div
                          key={role}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/30 cursor-pointer transition-colors"
                          onClick={() => {
                            setSelectedRoles((current) =>
                              isSelected
                                ? current.filter((r) => r !== role)
                                : [...current, role]
                            );
                          }}
                        >
                          <div
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all",
                              isSelected
                                ? "bg-gradient-to-r from-orange-500 to-amber-500 border-orange-600"
                                : "border-orange-300 dark:border-orange-700"
                            )}
                          >
                            {isSelected && (
                              <IconCircleCheckFilled className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <span className="text-sm font-medium capitalize">
                            {role}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <Separator className="bg-orange-200/30" />
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedRoles(row.original.rolesHaving);
                      setIsEditing(false);
                    }}
                    className="border-orange-200 hover:bg-orange-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        );
      }

      return (
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-1.5">
            {row.original.rolesHaving?.map((role) => (
              <Badge
                key={role}
                className={cn(
                  "text-xs font-semibold border-0",
                  roleColors[role] || "bg-slate-500 text-white"
                )}
              >
                {role}
              </Badge>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-orange-100 dark:hover:bg-orange-950/30"
            onClick={() => setIsEditing(true)}
          >
            <IconPencil className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        className={cn(
          "border-0 font-semibold",
          row.original.isActive
            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
            : "bg-gradient-to-r from-slate-400 to-slate-500 text-white"
        )}
      >
        {row.original.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-orange-50 dark:hover:bg-orange-950/30"
            >
              <span className="sr-only">Open menu</span>
              <IconDotsVertical className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="text-orange-600 font-semibold">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-orange-200/30" />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user._id)}
              className="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/30"
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/30">
              View profile
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-orange-200/30" />
            <DropdownMenuItem className="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/30">
              Send message
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/30">
              Deactivate user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function DataTable({ data }: { data: any[] }) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const handleAddRow = () => {
    toast.info("Add row feature coming soon!");
  };

  const handleSendInvite = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/user/send-admin-invite",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      if (!response.ok) throw new Error("Failed to send invite");
      toast.success("Admin invite sent successfully!");
      setEmail("");
    } catch (error) {
      toast.error("Failed to send invite. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    toast.info("Row reordering feature coming soon!");
  };

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalRows = table.getFilteredRowModel().rows.length;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-500" />
            <Input
              placeholder="Search by name or email..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="pl-9 h-9 border-orange-200 focus:border-orange-400 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="text-sm text-muted-foreground">
            {selectedCount > 0 && (
              <span className="font-medium text-orange-600">
                {selectedCount} of {totalRows} selected
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Send Admin Invite Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white h-9"
                >
                  <IconMail className="h-4 w-4 mr-2" />
                  Send Invite
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-orange-600">
                    Send Admin Invite
                  </DialogTitle>
                  <DialogDescription>
                    Enter the email of the user you want to invite as an admin.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="invite-email" className="text-base">
                      Email Address
                    </Label>
                    <Input
                      id="invite-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleSendInvite}
                    disabled={isLoading || !email}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white w-full"
                  >
                    {isLoading && (
                      <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isLoading ? "Sending..." : "Send Invite"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Add Row Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddRow}
              className="border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-950/30 h-9"
            >
              <IconPlus className="h-4 w-4 mr-2" />
              Add
            </Button>

            {/* Column Visibility Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-950/30 h-9"
                >
                  <IconLayoutColumns className="h-4 w-4 mr-2" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-orange-600 font-semibold">
                  Toggle Columns
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-orange-200/30" />
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide()
                  )
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/30"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Table */}
      <Card className="border-orange-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-b-2 border-orange-200/30">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="border-orange-200/30 hover:bg-transparent"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className="text-orange-700 dark:text-orange-400 font-bold"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                <SortableContext
                  items={data.map((item) => item._id)}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows?.length ? (
                    table
                      .getRowModel()
                      .rows.map((row) => (
                        <DraggableRow key={row.id} row={row} />
                      ))
                  ) : (
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        colSpan={columns.length}
                        className="h-32 text-center"
                      >
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <div className="text-5xl mb-2">🔍</div>
                          <p className="font-medium">No users found</p>
                          <p className="text-sm">Try adjusting your filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </Card>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between gap-2 flex-wrap px-2 py-3 bg-orange-50/50 dark:bg-orange-950/10 rounded-lg border border-orange-200/30">
        <div className="text-sm font-medium text-muted-foreground">
          {selectedCount > 0 ? (
            <span className="text-orange-600">
              {selectedCount} of {totalRows} row(s) selected
            </span>
          ) : (
            <span>
              Showing {totalRows > 0 ? 1 : 0} to{" "}
              {Math.min(table.getState().pagination.pageSize, totalRows)} of{" "}
              {totalRows} entries
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Rows Per Page */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Rows per page:</span>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-16 border-orange-200 focus:border-orange-400 focus:ring-orange-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page Info */}
          <div className="text-sm font-medium text-muted-foreground min-w-fit">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount() || 1}
          </div>

          {/* Pagination Buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-950/30"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              title="First page"
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft className="h-4 w-4 text-orange-600" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-950/30"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              title="Previous page"
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft className="h-4 w-4 text-orange-600" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-950/30"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              title="Next page"
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight className="h-4 w-4 text-orange-600" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-950/30"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              title="Last page"
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight className="h-4 w-4 text-orange-600" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
