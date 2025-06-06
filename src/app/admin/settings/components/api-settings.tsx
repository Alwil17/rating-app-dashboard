"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Copy, Key, Trash } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface ApiToken {
  id: string;
  name: string;
  createdAt: Date;
  lastUsed: Date | null;
  scopes: string[];
}

export function APISettings() {
  const [apiTokens, setApiTokens] = useState<ApiToken[]>([
    {
      id: "token_1",
      name: "Development App",
      createdAt: new Date(2023, 6, 15),
      lastUsed: new Date(2023, 9, 28),
      scopes: ["read:items", "write:ratings"]
    },
    {
      id: "token_2",
      name: "Mobile App",
      createdAt: new Date(2023, 8, 22),
      lastUsed: null,
      scopes: ["read:items", "read:ratings"]
    }
  ]);

  const [newTokenName, setNewTokenName] = useState("");
  const [newTokenScopes, setNewTokenScopes] = useState({
    readItems: true,
    writeItems: false,
    readRatings: true,
    writeRatings: false
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("API token copied to clipboard");
  };

  const deleteToken = (id: string) => {
    setApiTokens(apiTokens.filter(token => token.id !== id));
    toast.success("API token revoked successfully");
  };

  const createNewToken = () => {
    if (!newTokenName) {
      toast.error("Please provide a token name");
      return;
    }

    // Create scopes array from selected scopes
    const scopes = [];
    if (newTokenScopes.readItems) scopes.push("read:items");
    if (newTokenScopes.writeItems) scopes.push("write:items");
    if (newTokenScopes.readRatings) scopes.push("read:ratings");
    if (newTokenScopes.writeRatings) scopes.push("write:ratings");

    const newToken: ApiToken = {
      id: `token_${apiTokens.length + 1}_${Date.now()}`,
      name: newTokenName,
      createdAt: new Date(),
      lastUsed: null,
      scopes
    };

    setApiTokens([...apiTokens, newToken]);
    setNewTokenName("");
    
    // Show a fake token
    const fakeToken = `rt_${Math.random().toString(36).substring(2, 15)}`;
    toast.success(
      <div className="space-y-2">
        <p>Token created successfully!</p>
        <div className="p-2 bg-muted rounded-md font-mono text-sm flex items-center justify-between">
          <code>{fakeToken}</code>
          <button onClick={() => copyToClipboard(fakeToken)} className="ml-2">
            <Copy className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground">Make sure to copy it now. You won't be able to see it again!</p>
      </div>,
      {
        duration: 10000,
      }
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Access</CardTitle>
          <CardDescription>
            Manage API tokens for external applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiTokens.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last used</TableHead>
                  <TableHead>Scopes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiTokens.map((token) => (
                  <TableRow key={token.id}>
                    <TableCell className="font-medium">{token.name}</TableCell>
                    <TableCell>{token.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell>
                      {token.lastUsed ? token.lastUsed.toLocaleDateString() : 'Never'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {token.scopes.map((scope) => (
                          <Badge key={scope} variant="outline">
                            {scope}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteToken(token.id)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Revoke</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No API tokens found
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create New Token</CardTitle>
          <CardDescription>
            Generate an API token for a new application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token-name">Token Name</Label>
              <Input
                id="token-name"
                placeholder="e.g. Development App"
                value={newTokenName}
                onChange={(e) => setNewTokenName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="read-items">Read items</Label>
                    <p className="text-sm text-muted-foreground">
                      View items and categories
                    </p>
                  </div>
                  <Switch 
                    id="read-items" 
                    checked={newTokenScopes.readItems}
                    onCheckedChange={(checked) => setNewTokenScopes({...newTokenScopes, readItems: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="write-items">Write items</Label>
                    <p className="text-sm text-muted-foreground">
                      Create and modify items
                    </p>
                  </div>
                  <Switch 
                    id="write-items" 
                    checked={newTokenScopes.writeItems}
                    onCheckedChange={(checked) => setNewTokenScopes({...newTokenScopes, writeItems: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="read-ratings">Read ratings</Label>
                    <p className="text-sm text-muted-foreground">
                      View ratings and comments
                    </p>
                  </div>
                  <Switch 
                    id="read-ratings" 
                    checked={newTokenScopes.readRatings}
                    onCheckedChange={(checked) => setNewTokenScopes({...newTokenScopes, readRatings: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="write-ratings">Write ratings</Label>
                    <p className="text-sm text-muted-foreground">
                      Create and modify ratings
                    </p>
                  </div>
                  <Switch 
                    id="write-ratings" 
                    checked={newTokenScopes.writeRatings}
                    onCheckedChange={(checked) => setNewTokenScopes({...newTokenScopes, writeRatings: checked})}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button onClick={createNewToken}>
            <Key className="mr-2 h-4 w-4" />
            Generate Token
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>
            Learn how to use our API to integrate with your applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Our REST API provides programmatic access to rating data. You can use it to build integrations, automate workflows, or develop new applications that leverage our platform.
          </p>
          <div className="mt-4 grid gap-2">
            <Button variant="outline" className="justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor" 
                className="mr-2 h-4 w-4"
              >
                <path
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
              API Documentation
            </Button>
            <Button variant="outline" className="justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="mr-2 h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                />
              </svg>
              Code Examples
            </Button>
            <Button variant="outline" className="justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="mr-2 h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                />
              </svg>
              Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
