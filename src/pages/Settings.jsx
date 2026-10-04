import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/ThemeContext';
import { Check, User, Trash2, Bell, TrendingUp, BookOpen, ChevronRight, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  getReminderEnabled, getReminderTime, setReminderEnabled, setReminderTime,
  requestNotificationPermission,
} from '@/hooks/useDailyReminder';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/lib/AuthContext';
import { deleteOwnAccount } from '@/api/account';
import { toast } from '@/components/ui/use-toast';

export default function Settings() {
  const { theme, setTheme, themes } = useTheme();
  const { user, updateProfile, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user?.full_name) setUsername(user.full_name);
  }, [user]);
  const [deleting, setDeleting] = useState(false);
  const [reminderOn, setReminderOn] = useState(getReminderEnabled);
  const [reminderTime, setReminderTimeState] = useState(getReminderTime);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const handleToggleReminder = async (enabled) => {
    if (enabled) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        setPermissionDenied(true);
        return;
      }
      setPermissionDenied(false);
    }
    setReminderEnabled(enabled);
    setReminderOn(enabled);
  };

  const handleTimeChange = (time) => {
    setReminderTime(time);
    setReminderTimeState(time);
  };

  const handleSaveUsername = async () => {
    try {
      await updateProfile({ full_name: username });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save name', error);
      toast({
        title: "Couldn't save your name",
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteOwnAccount();
    } catch (error) {
      // Don't sign out on failure — the account still exists, so say so
      console.error('Failed to delete account', error);
      setDeleting(false);
      toast({
        title: "Couldn't delete your account",
        description: 'Nothing was deleted. Please check your connection and try again.',
        variant: 'destructive',
      });
      return;
    }
    // Also cancels the OS-scheduled reminder on iOS/Android, which clearing storage wouldn't
    setReminderEnabled(false);
    localStorage.clear();
    await logout();
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto px-4 pt-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
          <p className="text-xs text-muted-foreground">Personalise your space</p>
        </motion.div>

        {/* Username */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-primary" />
            <h2 className="font-bold text-foreground text-sm">Your Name</h2>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="What should we call you?"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSaveUsername()}
              className="rounded-xl"
            />
            <Button onClick={handleSaveUsername} className="rounded-xl px-4 shrink-0">
              {saved ? <Check className="w-4 h-4" /> : 'Save'}
            </Button>
          </div>
          {username && !saved && (
            <p className="text-xs text-muted-foreground mt-2">Hi, {username} 👋</p>
          )}
        </motion.div>

        {/* More pages */}
        <div className="mb-4">
          <h2 className="font-bold text-foreground text-sm mb-1 px-1">More</h2>
          <p className="text-xs text-muted-foreground px-1 mb-3">Track your progress.</p>
        </div>
        <div className="space-y-2 mb-8">
          <Link to="/progress" className="flex items-center gap-3 bg-card rounded-2xl p-4 border border-border/50 shadow-sm hover:bg-accent/40 transition-colors">
            <TrendingUp className="w-5 h-5 text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Progress Insights</p>
              <p className="text-xs text-muted-foreground">Mood trends and clean-streak milestones</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </Link>
          <Link to="/journal" className="flex items-center gap-3 bg-card rounded-2xl p-4 border border-border/50 shadow-sm hover:bg-accent/40 transition-colors">
            <BookOpen className="w-5 h-5 text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Journal History</p>
              <p className="text-xs text-muted-foreground">Past reflections with their dates</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </Link>
        </div>

        {/* Color Theme */}
        <div className="mb-4">
          <h2 className="font-bold text-foreground text-sm mb-1 px-1">Color Theme</h2>
          <p className="text-xs text-muted-foreground px-1 mb-4">Pick an accent color</p>
        </div>

        <div className="flex gap-4 justify-center flex-wrap mb-8">
          {themes.map((t) => (
            <motion.button
              key={t.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(t.id)}
              className={`relative w-12 h-12 rounded-full transition-all ${
                theme === t.id ? 'ring-2 ring-offset-2 ring-offset-background ring-white scale-110' : 'opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: t.color }}
            >
              {theme === t.id && (
                <Check className="w-5 h-5 absolute inset-0 m-auto"               style={{ color: (t.id === 'white' || t.id === 'yellow') ? '#111' : '#fff' }} />
              )}
            </motion.button>
          ))}
        </div>

        {/* Daily Reminder */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-primary" />
            <h2 className="font-bold text-foreground text-sm">Daily Reminder</h2>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-foreground font-medium">Remind me to log</p>
              <p className="text-xs text-muted-foreground">A nudge to check in each evening</p>
            </div>
            <Switch checked={reminderOn} onCheckedChange={handleToggleReminder} />
          </div>
          {reminderOn && (
            <div className="flex items-center gap-3">
              <Label htmlFor="reminder-time" className="text-xs text-muted-foreground shrink-0">Time</Label>
              <Input
                id="reminder-time"
                type="time"
                value={reminderTime}
                onChange={e => handleTimeChange(e.target.value)}
                className="rounded-xl text-base w-32"
              />
            </div>
          )}
          {permissionDenied && (
            <p className="text-xs text-destructive mt-3">
              {Capacitor.isNativePlatform()
                ? 'Notifications are turned off for Eir. Turn them on in your phone\'s Settings app to receive reminders.'
                : 'Notifications are blocked. Enable them in your browser settings to receive reminders.'}
            </p>
          )}
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm mb-6"
        >
          <Button variant="outline" onClick={handleLogout} className="w-full rounded-xl gap-2">
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Sign out of your account. Your data is saved and will be here when you return.
          </p>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm"
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="space-y-1 cursor-pointer group">
                <Button variant="destructive" size="sm" className="gap-2 rounded-xl" disabled={deleting}>
                  <Trash2 className="w-3.5 h-3.5" />
                  {deleting ? 'Deleting...' : 'Delete Account'}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Permanently deletes your account and everything in it. This cannot be undone.
                </p>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your account, along with all your journal entries, logs, and vents. You won't be able to sign in to it again, and this cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Yes, delete everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>

        {/* Contact */}
        <div className="text-center mt-6 pb-4">
          <p className="text-xs text-muted-foreground">
            Questions or feedback? Get in touch at{' '}
            <a href="mailto:Contact@eirselfhelp.com" className="text-primary font-medium">
              Contact@eirselfhelp.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}