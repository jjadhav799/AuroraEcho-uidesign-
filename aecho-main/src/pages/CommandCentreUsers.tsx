import { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Edit3,
  Search,
  Shield,
  UserCog,
  UserCheck,
  Users,
  ClipboardList,
  UserCircle2,
  Eye,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Combobox } from "@/components/ui/combobox";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

// Roles from stats (excluding Super Admin)
type Role =
  | "Domain Admin"
  | "Project Admin"
  | "Review Manager"
  | "Reviewer"
  | "User";
type Status = "Active" | "Inactive";

const ROLE_OPTIONS: Role[] = [
  "Domain Admin",
  "Project Admin",
  "Review Manager",
  "Reviewer",
  "User",
];
const STATUS_OPTIONS: Status[] = ["Active", "Inactive"];

// Dummy directory for edit form dropdown & search
const DIRECTORY = [
  {
    name: "Alice Johnson",
    email: "alice.johnson@aurora.com",
    role: "Domain Admin" as Role,
    status: "Active" as Status,
  },
  {
    name: "Brian Lee",
    email: "brian.lee@aurora.com",
    role: "Project Admin" as Role,
    status: "Active" as Status,
  },
  {
    name: "Catherine Smith",
    email: "catherine.smith@aurora.com",
    role: "Reviewer" as Role,
    status: "Inactive" as Status,
  },
  {
    name: "Daniel Roberts",
    email: "daniel.roberts@aurora.com",
    role: "User" as Role,
    status: "Active" as Status,
  },
  {
    name: "Emily Clark",
    email: "emily.clark@aurora.com",
    role: "Review Manager" as Role,
    status: "Active" as Status,
  },
];

export default function AdminConsole() {
  const navigate = useNavigate();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Add dialog state
  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState<Role>("User");
  const [addManager, setAddManager] = useState("");

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editUserKey, setEditUserKey] = useState<string>("");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<Role>("User");
  const [editStatus, setEditStatus] = useState<Status>("Active");

  const suggestions = useMemo(
    () =>
      DIRECTORY.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.status.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const managerOptions = useMemo(
    () =>
      DIRECTORY.map((u) => ({
        value: u.email,
        label: `${u.name} (${u.email})`,
      })),
    []
  );

  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedData: paginatedUsers,
    setCurrentPage,
    setPageSize,
  } = usePagination({ data: suggestions, initialPageSize: 10 });

  // Role Stats
  const roleStats = [
    {
      title: "Super Admin",
      value: 1,
      description: "Full system control",
      icon: Shield,
    },
    {
      title: "Domain Admins",
      value: 6,
      description: "Manage domains & governance",
      icon: UserCog,
    },
    {
      title: "Project Admins",
      value: 14,
      description: "Manage projects & access",
      icon: ClipboardList,
    },
    {
      title: "Review Managers",
      value: 5,
      description: "Supervise review workflows",
      icon: UserCheck,
    },
    {
      title: "Reviewers",
      value: 27,
      description: "Perform document & code reviews",
      icon: Users,
    },
  ];

  // Helper functions
  const emailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const resetAdd = () => {
    setAddName("");
    setAddEmail("");
    setAddRole("User");
    setAddManager("");
  };

  const handleAdd = () => {
    if (!addName.trim()) return toast.error("Name is required");
    if (!addEmail.trim() || !emailValid(addEmail))
      return toast.error("Enter a valid email");
    toast.success("User added");
    resetAdd();
    setAddOpen(false);
  };

  const onPickEditUser = (user: typeof DIRECTORY[0]) => {
    setEditUserKey(`${user.name} <${user.email}>`);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditStatus(user.status);
    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editUserKey) return toast.error("Pick a user to edit");
    if (!editName.trim()) return toast.error("Name is required");
    if (!editEmail.trim() || !emailValid(editEmail))
      return toast.error("Enter a valid email");
    toast.success("Changes saved");
    setEditOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground mt-1">
            Manage user access and permissions
          </p>
        </div>

        <div className="flex gap-2">
          {/* Add User Dialog */}
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[560px]">
              <DialogHeader>
                <DialogTitle>Add User</DialogTitle>
                <DialogDescription>
                  Create a new user account with role and status.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="add-name">Name *</Label>
                  <Input
                    id="add-name"
                    placeholder="Enter full name"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="add-email">Email *</Label>
                  <Input
                    id="add-email"
                    type="email"
                    placeholder="name@company.com"
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Role *</Label>
                  <Select value={addRole} onValueChange={(v: Role) => setAddRole(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="add-manager">Reporting Manager *</Label>
                  <Combobox
                    options={managerOptions}
                    value={addManager}
                    onValueChange={setAddManager}
                    placeholder="Select reporting manager"
                    searchPlaceholder="Search by name or email..."
                    emptyText="No managers found."
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setAddOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd}>Add</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Role Stats */}
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {roleStats.map((s) => {
          const Icon = s.icon as any;
          return (
            <Card key={s.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
                <Icon className="h-4 w-4 text-primary" /> {/* unified blue color */}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
                <p className="text-xs text-muted-foreground">{s.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage user access and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, role, or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((u) => (
                <TableRow key={u.email}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                      u.status === "Active" 
                        ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" 
                        : "bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300"
                    }`}>
                      {u.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPickEditUser(u)}
                      >
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/user-info?email=${encodeURIComponent(u.email)}`)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={suggestions.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />

          {suggestions.length === 0 && searchQuery && (
            <p className="text-sm text-muted-foreground text-center py-6">
              No users found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
