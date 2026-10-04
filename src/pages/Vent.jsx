import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { listRecentVents, createVent } from '@/api/vents';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, RefreshCw } from 'lucide-react';
import usePullToRefresh from '@/hooks/usePullToRefresh';
import { toast } from '@/components/ui/use-toast';

export default function Vent() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [username, setUsername] = useState('Anonymous');

  useEffect(() => {
    if (user?.full_name) setUsername(user.full_name);
  }, [user]);
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['vents'] });
  };
  const { containerRef, pullDistance, refreshing, threshold } = usePullToRefresh(handleRefresh);

  const { data: vents = [], isError: isVentsError } = useQuery({
    queryKey: ['vents'],
    queryFn: () => listRecentVents(3),
  });

  useEffect(() => {
    if (isVentsError) {
      console.error('Failed to load vents');
      toast({
        title: "Couldn't load vents",
        description: 'Check your connection and try refreshing.',
        variant: 'destructive',
      });
    }
  }, [isVentsError]);

  const createMutation = useMutation({
    mutationFn: (/** @type {any} */ data) => createVent(data),
    onMutate: async (newVent) => {
      await queryClient.cancelQueries({ queryKey: ['vents'] });
      const previous = queryClient.getQueryData(['vents']);
      const optimistic = { id: `temp-${Date.now()}`, ...newVent, created_at: new Date().toISOString() };
      queryClient.setQueryData(['vents'], (/** @type {any[]} */ old) => [optimistic, ...(old || [])]);
      setContent('');
      setSending(false);
      return { previous };
    },
    onError: (_, __, ctx) => {
      queryClient.setQueryData(['vents'], ctx.previous);
      toast({
        title: "Couldn't send your vent",
        description: 'Please try again.',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['vents'] });
    },
  });

  const handleSend = () => {
    if (!content.trim()) return;
    setSending(true);
    createMutation.mutate({ content: content.trim(), anonymous_name: username });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background pb-24 overflow-y-auto">
      {/* Pull-to-refresh indicator */}
      {pullDistance > 0 && (
        <div
          className="flex items-center justify-center text-primary"
          style={{ height: pullDistance, transition: refreshing ? 'height 0.2s' : 'none' }}
        >
          <RefreshCw className={`w-5 h-5 ${refreshing || pullDistance >= threshold ? 'animate-spin' : ''}`} />
        </div>
      )}
      <div className="max-w-lg mx-auto px-4 pt-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-6"
        >
          <p className="text-xs text-muted-foreground">Let it out. It's private and safe.</p>
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm mb-6"
        >
          <Textarea
            placeholder="Whatever you're feeling right now... let it out here."
            value={content}
            onChange={e => setContent(e.target.value)}
            className="min-h-[100px] resize-none border-none bg-transparent focus-visible:ring-0 text-base p-0 mb-3"
          />
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground">Posted privately</p>
            <Button
              size="sm"
              className="rounded-full gap-1.5"
              disabled={!content.trim() || sending}
              onClick={handleSend}
            >
              <Send className="w-3.5 h-3.5" /> Send
            </Button>
          </div>
        </motion.div>

        {/* Vents Feed */}
        <div className="space-y-3">
          <AnimatePresence>
            {vents.map((vent, i) => (
              <motion.div
                key={vent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm"
              >
                <p className="text-sm text-foreground leading-relaxed mb-2">{vent.content}</p>

              </motion.div>
            ))}
          </AnimatePresence>
          {vents.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              Be the first to vent. It's safe here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}