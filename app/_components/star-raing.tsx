"use client";

import React from "react";
import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export default function StarRating({
  onRating,
}: {
  onRating: (value: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);

  function confirmRating(star) {
    setSelected(star);
    onRating(star);
  }

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hovered || selected);
        return (
          <React.Fragment key={star}>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                >
                  <Star
                    size={24}
                    strokeWidth={2}
                    color={isActive ? "#FFD700" : "#4B5563"}
                    fill={isActive ? "#FFD700" : "none"}
                  />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[60%] rounded-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar a avaliação?</AlertDialogTitle>
                  <AlertDialogDescription></AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Não</AlertDialogCancel>
                  <AlertDialogAction onClick={() => confirmRating(star)}>
                    Sim
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </React.Fragment>
        );
      })}
    </div>
  );
}
