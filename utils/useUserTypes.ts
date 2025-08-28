"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { getUserType } from "@/actions/supabaseUser";
import { toast } from "sonner";

export function useUserType() {
  const { userId, getToken } = useAuth();
  const [userType, setUserType] = useState<"mechanic" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchType = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      const token = await getToken({ template: "supabase" });

      if (!token) {
        toast.error("User authentication failed. Please sign in again.");
        setLoading(false);
        return;
      }

      const type = await getUserType(userId, token);
      setUserType(type); // already narrowed in getUserType
      setLoading(false);
    };

    fetchType();
  }, [userId, getToken]);

  return { userType, loading };
}
