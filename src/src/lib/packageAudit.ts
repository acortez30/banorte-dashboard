// src/lib/packageAudit.ts

export const SUPPORTED_PACKAGE_AUDIT_TOPICS = new Set([
    1,
    8,
    14,
    25,
    35,
    36,
    37,
    41,
    66,
]);

interface PackageAuditEvent {
    id_topic_audit?: number | string | null;
    description?: string | null;
    registration_date?: string | null;
    created_at?: string | null;
}

/* =========================================================
   GET TRANSLATION KEY
========================================================= */

export const getPackageAuditTranslationKey = (
    idTopicAudit: unknown,
): string | null => {
    const id = Number(idTopicAudit);

    if (
        !Number.isInteger(id) ||
        !SUPPORTED_PACKAGE_AUDIT_TOPICS.has(id)
    ) {
        return null;
    }

    return `package.audit.${id}`;
};

/* =========================================================
   INTERPOLATE
========================================================= */

const interpolateAuditText = (
    template: string,
    values: Record<string, string>,
): string => {
    return Object.entries(values).reduce(
        (result, [key, value]) =>
            result.replace(
                new RegExp(`\\{${key}\\}`, 'g'),
                value,
            ),
        template,
    );
};

/* =========================================================
   GET TRANSLATED DESCRIPTION
========================================================= */

export const getPackageAuditDescription = ({
    event,
    tracking,
    language,
    t,
}: {
    event: PackageAuditEvent;
    tracking: string;
    language: string;
    t: (key: string) => string;
}): string | null => {
    const topicId = Number(
        event.id_topic_audit,
    );

    const translationKey =
        getPackageAuditTranslationKey(
            topicId,
        );

    if (!translationKey) {
        return null;
    }

    const translated =
        t(translationKey);

    /*
     * Solo el topic 8 requiere valores dinámicos:
     *
     * tracking
     * fecha
     */
    if (topicId !== 8) {
        return translated;
    }

    const rawDate =
        event.registration_date ??
        event.created_at;

    const parsedDate = rawDate
        ? new Date(rawDate)
        : null;

    const hasValidDate =
        parsedDate &&
        !Number.isNaN(
            parsedDate.getTime(),
        );

    const date = hasValidDate
        ? parsedDate.toLocaleString(
              language === 'en'
                  ? 'en-US'
                  : 'es-MX',
              {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
              },
          )
        : '—';

    return interpolateAuditText(
        translated,
        {
            tracking:
                tracking || '—',
            date,
        },
    );
};