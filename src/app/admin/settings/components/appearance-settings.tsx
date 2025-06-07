"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Customize the appearance of the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            defaultValue={theme}
            onValueChange={(value) => setTheme(value)}
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem
                value="light"
                id="theme-light"
                className="peer sr-only"
              />
              <Label
                htmlFor="theme-light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div className="mb-2 rounded-md border border-muted p-1 shadow-sm">
                  <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                    <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                      <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                      <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                      <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                      <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                    </div>
                  </div>
                </div>
                <span className="block w-full text-center font-normal">
                  Light
                </span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="dark"
                id="theme-dark"
                className="peer sr-only"
              />
              <Label
                htmlFor="theme-dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div className="mb-2 rounded-md border border-muted p-1 shadow-sm">
                  <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                    <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                      <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-slate-400" />
                      <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-slate-400" />
                      <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                    </div>
                  </div>
                </div>
                <span className="block w-full text-center font-normal">
                  Dark
                </span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="system"
                id="theme-system"
                className="peer sr-only"
              />
              <Label
                htmlFor="theme-system"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div className="mb-2 rounded-md border border-muted p-1 shadow-sm">
                  <div className="space-y-2 rounded-sm bg-gradient-to-r from-[#ecedef] to-slate-950 p-2">
                    <div className="space-y-2 rounded-md bg-gradient-to-r from-white to-slate-800 p-2 shadow-sm">
                      <div className="h-2 w-[80px] rounded-lg bg-gradient-to-r from-[#ecedef] to-slate-400" />
                      <div className="h-2 w-[100px] rounded-lg bg-gradient-to-r from-[#ecedef] to-slate-400" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-gradient-to-r from-white to-slate-800 p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-gradient-to-r from-[#ecedef] to-slate-400" />
                      <div className="h-2 w-[100px] rounded-lg bg-gradient-to-r from-[#ecedef] to-slate-400" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-gradient-to-r from-white to-slate-800 p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-gradient-to-r from-[#ecedef] to-slate-400" />
                      <div className="h-2 w-[100px] rounded-lg bg-gradient-to-r from-[#ecedef] to-slate-400" />
                    </div>
                  </div>
                </div>
                <span className="block w-full text-center font-normal">
                  System
                </span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interface Display</CardTitle>
          <CardDescription>
            Customize how the interface is displayed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dense-mode">Dense mode</Label>
                <p className="text-sm text-muted-foreground">
                  Display more content on the screen with tighter spacing
                </p>
              </div>
              <Switch id="dense-mode" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="animations">Animations</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable UI animations throughout the app
                </p>
              </div>
              <Switch id="animations" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compact-sidebar">Compact sidebar</Label>
                <p className="text-sm text-muted-foreground">
                  Reduce the width of the navigation sidebar
                </p>
              </div>
              <Switch id="compact-sidebar" />
            </div>
            
            <Button className="w-full">Reset to defaults</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
