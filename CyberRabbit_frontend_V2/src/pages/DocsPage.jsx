import { useCallback, useMemo, useRef, useState } from 'react';
import { docsSections } from '../content/docsContent.js';

/**
 * Parses the body[] array from docsContent into structured JSX.
 * - Lines ending with ":" become subheadings.
 * - Lines starting with "- " become list items (grouped into <ul>).
 * - Everything else is a paragraph.
 */
function renderDocBody(lines) {
  const elements = [];
  let listBuffer = [];
  let key = 0;

  const flushList = () => {
    if (listBuffer.length > 0) {
      elements.push(
        <ul key={`list-${key++}`} className="doc-list">
          {listBuffer.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  lines.forEach((line) => {
    if (line.startsWith('- ')) {
      listBuffer.push(line.slice(2));
    } else {
      flushList();
      if (line.endsWith(':') && line.length < 60) {
        elements.push(
          <h3 key={`h-${key++}`} className="doc-subheading">{line.slice(0, -1)}</h3>
        );
      } else {
        elements.push(<p key={`p-${key++}`}>{line}</p>);
      }
    }
  });

  flushList();
  return elements;
}

function DocsPage() {
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(docsSections[0].id);
  const contentRef = useRef(null);

  const filteredSections = useMemo(() => {
    const q = query.toLowerCase();
    return docsSections.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q)
    );
  }, [query]);

  const activeSection = filteredSections.find((s) => s.id === activeId)
    || filteredSections[0];

  const handleSectionClick = useCallback((id) => {
    setActiveId(id);
    /* Scroll content to top on section change */
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, []);

  return (
    <section className="page docs-page">
      <div className="docs-container">

        {/* Sidebar */}
        <aside className="docs-sidebar" aria-label="Documentation navigation">
          <h2 className="docs-sidebar-title">Indian Cyber Laws</h2>

          <div className="docs-search">
            <input
              type="search"
              placeholder="Search laws..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search documentation"
            />
          </div>

          <nav className="docs-nav" role="tablist" aria-label="Law sections">
            {filteredSections.map((section) => (
              <button
                key={section.id}
                role="tab"
                aria-selected={activeId === section.id}
                className={`docs-link ${activeId === section.id ? 'active' : ''}`}
                onClick={() => handleSectionClick(section.id)}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main
          className="docs-content"
          ref={contentRef}
          role="tabpanel"
          aria-label="Law details"
        >
          {activeSection && (
            <>
              <h1 className="doc-title">{activeSection.title}</h1>
              <p className="doc-summary">{activeSection.summary}</p>

              <div className="doc-body">
                {renderDocBody(activeSection.body)}
              </div>

              <a
                href={activeSection.link}
                target="_blank"
                rel="noopener noreferrer"
                className="doc-link-btn"
              >
                Read Full Law →
              </a>
            </>
          )}
        </main>

      </div>
    </section>
  );
}

export default DocsPage;