import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { motion } from "framer-motion";

interface CodeBlockProps {
  index: number;
  text: string;
  moveBlock: (dragIndex: number, hoverIndex: number) => void;
}

export function CodeBlock({ index, text, moveBlock }: CodeBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "CODE_BLOCK",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "CODE_BLOCK",
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveBlock(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <motion.div
      ref={ref}
      className={`p-2 mb-2 rounded cursor-move ${
        isDragging
          ? "bg-blue-200 dark:bg-blue-700"
          : "bg-white dark:bg-gray-600"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <pre className="text-sm font-mono">{text}</pre>
    </motion.div>
  );
}
