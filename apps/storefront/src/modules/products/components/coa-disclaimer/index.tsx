const CoaDisclaimer = () => {
  return (
    <div className="content-container border-t border-ui-border-base py-10">
      <div className="max-w-3xl mx-auto flex flex-col gap-y-3 text-small-regular text-ui-fg-subtle">
        <h3 className="text-base-semi text-ui-fg-base">
          Batch Testing &amp; Certificate of Analysis
        </h3>
        <p>
          Every batch we sell is independently tested via HPLC and mass
          spectrometry to verify identity and purity. Certificates of
          Analysis (COAs) are available for download on individual product
          pages.
        </p>
        <p>
          To protect our sourcing relationships, we redact our testing
          partner&apos;s name, contact details, and any QR codes or
          verification links from the COAs we publish. Purity and identity
          results are shown in full and unaltered.
        </p>
      </div>
    </div>
  )
}

export default CoaDisclaimer
