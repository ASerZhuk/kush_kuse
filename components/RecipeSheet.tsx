"use client";

import { useState } from "react";
import BottomSheet from "@/components/BottomSheet";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";

const RECIPES = ["Треска свежего улова", "Индейка", "Ягнёнок"];

export default function RecipeSheet() {
  const [recipe, setRecipe] = useState(0);

  return (
    <BottomSheet
      trigger={(open) => (
        <Button variant="primary" onClick={open}>
          Подробнее
        </Button>
      )}
    >
      {() => (
        <>
          <h2 className="font-display text-subtitle text-dark">Рецепт</h2>

          <div className="mt-6 flex flex-col gap-3">
            {RECIPES.map((label, index) => (
              <Chip
                key={label}
                className="w-full"
                selected={recipe === index}
                onClick={() => setRecipe(index)}
              >
                {label}
              </Chip>
            ))}
          </div>

          <p className="mt-6 text-body text-grey-300">
            Переход мягкий: семь дней 20/80, семь дней 50/50, дальше —
            полностью.
          </p>
        </>
      )}
    </BottomSheet>
  );
}
