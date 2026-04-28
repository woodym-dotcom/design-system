import * as React from 'react';

export interface ListPageHeaderProps {
  title: string;
  subtitle?: string;
  /** Filter controls (search, dropdowns, chips). Rendered as a flexible slot. */
  filters?: React.ReactNode;
  /** Primary create-button (or button group). Rendered on the right. */
  createAction?: React.ReactNode;
  className?: string;
}

export function ListPageHeader({
  title,
  subtitle,
  filters,
  createAction,
  className,
}: ListPageHeaderProps) {
  const classes = ['cc-list-page-header'];
  if (className) classes.push(className);
  return (
    <header className={classes.join(' ')}>
      <div className="cc-list-page-header__lead">
        <h1 className="cc-list-page-header__title">{title}</h1>
        {subtitle ? <p className="cc-list-page-header__subtitle">{subtitle}</p> : null}
      </div>
      {filters ? <div className="cc-list-page-header__filters">{filters}</div> : null}
      {createAction ? <div className="cc-list-page-header__actions">{createAction}</div> : null}
    </header>
  );
}
