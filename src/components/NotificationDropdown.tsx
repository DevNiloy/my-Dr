import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Bell, Check, Clock, ExternalLink,
  Loader2, MoreHorizontal, FileText, ShieldCheck, UserPlus
} from "lucide-react";
import {
  useGetMyNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from "../redux/api/notificationApi";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function TypeIcon({ type, unread }: { type: string; unread: boolean }) {
  const base = unread
    ? "bg-gradient-to-tr from-[#ea285a] to-rose-400 text-white shadow-lg shadow-rose-200"
    : "bg-slate-100 text-slate-400";
  return (
    <div className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${base}`}>
      {type === "APPOINTMENT"       ? <Clock size={18} />      :
       type === "PRESCRIPTION"      ? <FileText size={18} />   :
       type === "REPORT"            ? <FileText size={18} />   :
       type === "FINANCE"           ? <Check size={18} />      :
       type === "DOCTOR_VERIFICATION" ? <ShieldCheck size={18} /> :
       type === "USER_REGISTRATION" ? <UserPlus size={18} />  :
                                      <Bell size={18} />}
    </div>
  );
}

const LIMIT = 10;

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage]     = useState(1);
  const [items, setItems]   = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const dropdownRef  = useRef<HTMLDivElement>(null);
  const sentinelRef  = useRef<HTMLDivElement>(null);
  const navigate     = useNavigate();

  // ── Query ──────────────────────────────────────────────────────────────
  const { data, isLoading, isFetching, refetch } = useGetMyNotificationsQuery(
    { page, limit: LIMIT },
    { skip: !isOpen, refetchOnMountOrArgChange: true }
  );

  const unreadCount = data?.unreadCount ?? items.filter(n => !n.isRead).length;
  // Keep unread count available even when panel is closed
  const { data: countData } = useGetMyNotificationsQuery(
    { page: 1, limit: 1 },
    { pollingInterval: 30000 }  // poll every 30s for badge
  );
  const badgeCount = countData?.unreadCount ?? 0;

  const [markAsRead]    = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  // ── Accumulate pages ───────────────────────────────────────────────────
  useEffect(() => {
    if (!data?.data) return;
    setTotalPages(data.pages ?? 1);
    if (page === 1) {
      setItems(data.data);          // replace on fresh load
    } else {
      setItems(prev => {
        const ids = new Set(prev.map((n: any) => n._id));
        const fresh = data.data.filter((n: any) => !ids.has(n._id));
        return [...prev, ...fresh];
      });
    }
  }, [data]);                        // ← only depend on `data`, NOT page

  // ── Open → force page-1 refresh ───────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      if (page !== 1) {
        setPage(1);   // triggers new query
        setItems([]);
      } else {
        // page is already 1 — just refetch manually
        setItems([]);
        refetch();
      }
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Infinite scroll sentinel ───────────────────────────────────────────
  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && page < totalPages && !isFetching) {
        setPage(p => p + 1);
      }
    }, { threshold: 0.1 });
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [page, totalPages, isFetching, items.length]);

  // ── Outside click ──────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleClick = useCallback(async (notif: any) => {
    if (!notif.isRead) {
      await markAsRead(notif._id);
      setItems(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
    }
    setIsOpen(false);
    if (notif.link) navigate(notif.link);
  }, [markAsRead, navigate]);

  const handleMarkAll = useCallback(async () => {
    await markAllAsRead({});
    setItems(prev => prev.map(n => ({ ...n, isRead: true })));
  }, [markAllAsRead]);

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="relative p-2.5 rounded-2xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 shadow-sm transition-all group"
      >
        <Bell size={22} className="group-hover:rotate-12 transition-transform duration-200" />
        {badgeCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 bg-[#ea285a] text-white text-[10px] font-black border-2 border-white rounded-full flex items-center justify-center shadow-md animate-bounce">
            {badgeCount > 99 ? "99+" : badgeCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-4 w-[420px] bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_24px_60px_rgba(0,0,0,0.18)] z-[200] overflow-hidden flex flex-col max-h-[600px] animate-in slide-in-from-top-4 duration-300">

          {/* Header */}
          <div className="px-7 py-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/95 backdrop-blur">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Notifications</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="text-[10px] font-black text-[#ea285a] bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-full uppercase tracking-widest transition-colors active:scale-95"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1 min-h-0">
            {isLoading && items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-[#ea285a]" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Loading…</p>
              </div>
            ) : items.length === 0 && !isFetching ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-center mb-6 rotate-6">
                  <Bell size={36} className="text-slate-200" />
                </div>
                <h4 className="text-lg font-black text-slate-900">All clear!</h4>
                <p className="text-sm text-slate-400 font-medium mt-2 leading-relaxed max-w-[220px]">
                  No notifications yet. We'll alert you right when something happens.
                </p>
              </div>
            ) : (
              <div className="p-3 flex flex-col gap-2">
                {items.map((notif: any) => {
                  const unread = !notif.isRead;
                  return (
                    <div
                      key={notif._id}
                      onClick={() => handleClick(notif)}
                      className={`group relative flex gap-4 p-5 rounded-[2rem] border-2 cursor-pointer transition-all duration-200 ${
                        unread
                          ? "bg-gradient-to-br from-rose-50/80 via-white to-indigo-50/60 border-rose-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                          : "bg-slate-50/30 border-slate-100 hover:bg-white hover:border-slate-200"
                      }`}
                    >
                      <TypeIcon type={notif.type} unread={unread} />

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <p className={`text-sm truncate ${unread ? "font-black text-slate-900" : "font-semibold text-slate-500"}`}>
                            {notif.title}
                          </p>
                          <span className={`text-[9px] font-black uppercase tracking-widest shrink-0 ${unread ? "text-[#ea285a]" : "text-slate-400"}`}>
                            {dayjs(notif.createdAt).fromNow()}
                          </span>
                        </div>
                        <p className={`text-xs line-clamp-2 leading-relaxed ${unread ? "text-slate-600 font-semibold" : "text-slate-400"}`}>
                          {notif.message}
                        </p>
                        {notif.link && (
                          <span className={`mt-2 inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest rounded-full px-3 py-1 ${
                            unread ? "bg-rose-50 text-[#ea285a]" : "bg-slate-100 text-slate-500"
                          }`}>
                            View details <ExternalLink size={9} />
                          </span>
                        )}
                      </div>

                      {/* Unread indicator */}
                      {unread ? (
                        <div className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-[#ea285a] animate-pulse" />
                      ) : (
                        <div className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-slate-200" />
                      )}
                    </div>
                  );
                })}

                {/* Infinite scroll sentinel */}
                <div ref={sentinelRef} className="pb-2">
                  {isFetching && (
                    <div className="flex items-center justify-center gap-2 py-5">
                      <Loader2 size={16} className="animate-spin text-[#ea285a]" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading more…</span>
                    </div>
                  )}
                  {!isFetching && page >= totalPages && items.length > 5 && (
                    <div className="flex items-center justify-center gap-3 py-5">
                      <div className="h-px w-10 bg-slate-100" />
                      <MoreHorizontal size={14} className="text-slate-300" />
                      <div className="h-px w-10 bg-slate-100" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-slate-100 px-7 py-4 flex items-center justify-between bg-white">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Notifications</span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{items.length} of {data?.total ?? 0}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
