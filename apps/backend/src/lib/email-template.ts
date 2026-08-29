export const SITE_NAME = "Amber Hour Coffee Co."

/**
 * Wraps email body HTML with the site banner and consistent footer, so every
 * system email (order confirmation, and future ones) shares the same shell.
 */
export const wrapEmailBody = (bodyHtml: string): string => {
  const bannerUrl = process.env.EMAIL_BANNER_URL

  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1f1a17;">
      ${
        bannerUrl
          ? `<img src="${bannerUrl}" alt="${SITE_NAME}" style="width:100%;height:auto;display:block;margin-bottom:24px;" />`
          : ""
      }
      ${bodyHtml}
      <p style="margin-top:32px;padding-top:16px;border-top:1px solid #e6dccf;font-size:12px;color:#5e554e;">
        ${SITE_NAME} &mdash; roasted in small batches, shipped fresh.
      </p>
    </div>
  `
}
