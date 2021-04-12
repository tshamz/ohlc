import { memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export const Portal = memo(({ id = Date.now(), classes, parent, children }) => {
  const el = document.getElementById(id) || document.createElement('div');
  const container = useRef(el);

  const [dynamic] = useState(!container.current.parentElement);

  useEffect(() => {
    if (dynamic && parent !== null) {
      container.current.id = id;
      container.current.classList.add(...classes);
      parent.appendChild(container.current);
    }

    return () => {
      if (dynamic && container.current.parentElement) {
        container.current.parentElement.removeChild(container.current);
      }
    };
  }, [id, parent]);

  return createPortal(children, container.current);
});
