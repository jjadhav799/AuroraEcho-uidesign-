import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ArrowLeft, Search } from "lucide-react";
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
  documents: string[];
};

const ALL_DOCUMENTS = ["NDA.pdf", "Security-Policy.docx", "Onboarding-Guide.pdf", "Training-Manual.pdf"];

const initialUsers: UserRow[] = [
  { id: 1, name: "Alice Johnson",    email: "alice.johnson@aurora.com",   role: "Admin",   status: "Active",   documents: ["NDA.pdf"] },
  { id: 2, name: "Brian Lee",        email: "brian.lee@aurora.com",       role: "Manager", status: "Active",   documents: [] },
  { id: 3, name: "Catherine Smith",  email: "catherine.smith@aurora.com", role: "User",    status: "Inactive", documents: [] },
  { id: 4, name: "Daniel Roberts",   email: "daniel.roberts@aurora.com",  role: "User",    status: "Active",   documents: ["Security-Policy.docx"] },
  { id: 5, name: "Emily Clark",      email: "emily.clark@aurora.com",     role: "Manager", status: "Active",  documents: [] },
  { id: 6, name: "Frank Harris",     email: "frank.harris@aurora.com",    role: "Admin",   status: "Active",   documents: [] },
];

export default function CommandCentreUserConfig() {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<UserRow | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.status.toLowerCase().includes(q)
    );
  }, [users, search]);

  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedData: paginatedUsers,
    setCurrentPage,
    setPageSize,
  } = usePagination({ data: filtered, initialPageSize: 10 });

  const badgeVariant = (s: Status) => (s === "Active" ? "default" : s === "Pending" ? "outline" : "secondary");

  const updateUser = (id: number, patch: Partial<UserRow>) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));

  const toggleDocument = (doc: string) => {
    if (!selected) return;
    const isSelected = selected.documents.includes(doc);
    updateUser(selected.id, {
      documents: isSelected
        ? selected.documents.filter((d) => d !== doc)
        : [...selected.documents, doc],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Configuration</h1>
          <p className="text-muted-foreground mt-1">Search and select a user to assign documents</p>
        </div>

        {selected && (
          <Button variant="ghost" onClick={() => setSelected(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        )}
      </div>

      {/* List view */}
      {!selected && (
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Select a user to configure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search by name, email, role, or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((u) => (
                  <TableRow
                    key={u.id}
                    className="cursor-pointer hover:bg-muted/40"
                    onClick={() => setSelected(u)}
                  >
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>
                      <Badge variant={badgeVariant(u.status) as any}>{u.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filtered.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </CardContent>
        </Card>
      )}

      {/* Detail/config view */}
      {selected && (
        <Card>
          <CardHeader>
            <CardTitle>{selected.name}</CardTitle>
            <CardDescription>{selected.email} — {selected.role} — {selected.status}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Documents */}
            <section className="space-y-3">
              <h3 className="font-medium">Assign Documents</h3>
              
              <div className="space-y-3">
                {ALL_DOCUMENTS.map((doc) => (
                  <div key={doc} className="flex items-center space-x-2">
                    <Checkbox
                      id={`doc-${doc}`}
                      checked={selected.documents.includes(doc)}
                      onCheckedChange={() => toggleDocument(doc)}
                    />
                    <label
                      htmlFor={`doc-${doc}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {doc}
                    </label>
                  </div>
                ))}
              </div>

              {selected.documents.length === 0 && (
                <p className="text-sm text-muted-foreground pt-2">No documents assigned to this user.</p>
              )}

              <Button 
                className="mt-4"
                onClick={() => {
                  toast.success(`Documents assigned to ${selected.name}`);
                }}
              >
                Assign
              </Button>
            </section>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
