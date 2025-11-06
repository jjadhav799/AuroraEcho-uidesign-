import { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ShieldCheck, UserCog, Search, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

type Role = "Admin" | "Manager" | "User";
type Status = "Active" | "Inactive" | "Pending";

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: Status;
  lastLogin: string;
};

const initialUsers: UserRow[] = [
  { id: 1, name: "Alice Johnson", email: "alice.johnson@aurora.com", role: "Admin",   status: "Active",   lastLogin: "2 hours ago" },
  { id: 2, name: "Brian Lee",     email: "brian.lee@aurora.com",     role: "Manager", status: "Active",   lastLogin: "1 day ago" },
  { id: 3, name: "Catherine Smith", email: "catherine.smith@aurora.com", role: "User", status: "Inactive", lastLogin: "3 weeks ago" },
  { id: 4, name: "Daniel Roberts", email: "daniel.roberts@aurora.com", role: "User",   status: "Active",   lastLogin: "5 hours ago" },
  { id: 5, name: "Emily Clark",    email: "emily.clark@aurora.com",    role: "Manager", status: "Pending", lastLogin: "—" },
  { id: 6, name: "Frank Harris",   email: "frank.harris@aurora.com",   role: "Admin",  status: "Active",   lastLogin: "2 days ago" },
];

export default function AdminConsole() {
  // directory state
  const [users, setUsers] = useState<UserRow[]>(initialUsers);

  // filters/search
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");

  // dialog state
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<Role>("User");
  const [newStatus, setNewStatus] = useState<Status>("Active");

  const filteredUsers = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const stats = [
    {
      title: "Active Users",
      value: users.filter((u) => u.status === "Active").length,
      icon: ShieldCheck,
      color: "text-accent",
      description: "Currently active accounts",
    },
    {
      title: "Admins",
      value: users.filter((u) => u.role === "Admin").length,
      icon: UserCog,
      color: "text-chart-2",
      description: "System administrators",
    },
  ];

  const resetForm = () => {
    setNewName("");
    setNewEmail("");
    setNewRole("User");
    setNewStatus("Active");
  };

  const emailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAddUser = () => {
    if (!newName.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!newEmail.trim() || !emailValid(newEmail)) {
      toast.error("Enter a valid email");
      return;
    }
    if (users.some((u) => u.email.toLowerCase() === newEmail.toLowerCase())) {
      toast.error("A user with this email already exists");
      return;
    }

    const next: UserRow = {
      id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      status: newStatus,
      lastLogin: "—",
    };

    setUsers((prev) => [next, ...prev]);
    toast.success("User added");
    resetForm();
    setOpen(false);
  };

  const badgeVariant = (s: Status) =>
    s === "Active" ? "default" : s === "Pending" ? "outline" : "secondary";

  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedData: paginatedUsers,
    setCurrentPage,
    setPageSize,
  } = usePagination({ data: users, initialPageSize: 10 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Command Centre</h1>
          <p className="text-muted-foreground mt-1">
            Manage user accounts, roles, and access privileges
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>Add User</DialogTitle>
              <DialogDescription>
                Create a new user account with role and status.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter full name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="name@company.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Role *</Label>
                  <Select
                    value={newRole}
                    onValueChange={(v: Role) => setNewRole(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Status *</Label>
                  <Select
                    value={newStatus}
                    onValueChange={(v: Status) => setNewStatus(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        {stats.map((s) => {
          const Icon = s.icon as any;
          return (
            <Card key={s.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
                <Icon className={`h-4 w-4 ${s.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
                <p className="text-xs text-muted-foreground">{s.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* User Directory */}
      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
          <CardDescription>View and filter all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={roleFilter}
              onValueChange={(v: "all" | Role) => setRoleFilter(v)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="User">User</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v: "all" | Status) => setStatusFilter(v)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Last Login</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>
                    <Badge variant={badgeVariant(u.status) as any}>{u.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {u.lastLogin}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={users.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </CardContent>
      </Card>
    </div>
  );
}
