export function renderFigmaTokenWorkflow(): string {
  return `
    <article style="max-width:1100px;margin:0 auto;padding:24px 0 48px;font-family:Inter, 'Segoe UI', sans-serif;color:#1f2a37;line-height:1.6;">
      <header style="margin-bottom:24px;">
        <p style="margin:0 0 8px;color:#0e7490;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Design Tokens</p>
        <h1 style="margin:0;font-size:40px;line-height:1.1;color:#111827;">Figma Token Sync and Usage Workflow</h1>
      </header>

      <section style="margin-bottom:32px;">
        <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Summary</h2>
        <p style="margin:0;color:#374151;">This workflow defines a repeatable process for connecting Figma to the design tokens in this repository so contributors can update token source files from Figma, pull repository updates back into Figma, and apply tokens correctly in design files.</p>
      </section>

      <section style="margin-bottom:32px;">
        <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Source of truth</h2>
        <ul style="margin:0;padding-left:20px;color:#374151;">
          <li><strong>Canonical file:</strong> <code>packages/tokens/tokens.json</code></li>
          <li><strong>Sync mode:</strong> single-file sync mode in Token Studio</li>
          <li><strong>Generated output:</strong> <code>packages/tokens/dist/tokens.json</code> is generated and must not be edited in Figma</li>
        </ul>
      </section>

      <section style="margin-bottom:32px;">
        <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Branch policy</h2>
        <p style="margin:0;color:#374151;">Configure <strong>main</strong> as the sync provider's base branch. For each token update, use Token Studio to create a new issue branch, push the change to that branch, and open a pull request back to <strong>main</strong>. Do not push token edits directly to <strong>main</strong>.</p>
      </section>

      <section style="margin-bottom:32px;">
        <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Setup</h2>
        <aside style="margin:0 0 20px;border:1px solid #b8d8e3;border-left:4px solid #0e7490;background:#f0f9fc;padding:12px 16px;color:#1f2a37;">
          <strong>Prerequisite:</strong> Your GitHub account must belong to the <a href="https://github.com/orgs/az-digital/teams/developers" target="_blank" rel="noreferrer" style="color:#0369a1;font-weight:700;">Arizona Digital developers team</a>.
        </aside>
        <h3 style="margin:0 0 8px;font-size:18px;color:#111827;">Supported plugin: Tokens Studio for Figma</h3>
        <p style="margin:0 0 20px;color:#374151;">These instructions apply to Tokens Studio. Follow the <a href="https://docs.tokens.studio/get-started/install-figma-plugin" target="_blank" rel="noreferrer" style="color:#0369a1;font-weight:700;">official plugin installation guide</a> before continuing. Other supported Figma plugins will have their own setup instructions.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;">
          <div style="border-left:4px solid #0e7490;padding:4px 0 4px 18px;">
            <h3 style="margin:0 0 8px;font-size:16px;color:#111827;">1. Create a fine-grained PAT</h3>
            <ol style="margin:0;padding-left:20px;color:#374151;">
              <li>Open GitHub account settings and select <strong>Credentials</strong>.</li>
              <li>Create a fine-grained personal access token.</li>
              <li>Set the token expiration to no more than one year.</li>
              <li>Set the resource owner to <code>az-digital</code>.</li>
              <li>Choose <strong>Only select repositories</strong> and select <code>az-digital/design</code>.</li>
              <li>Set <strong>Contents</strong> to <strong>Read and write</strong>.</li>
              <li>Leave the required <strong>Metadata</strong> permission as <strong>Read-only</strong>.</li>
            </ol>
            <p style="margin:10px 0 0;color:#374151;">See GitHub's <a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens" target="_blank" rel="noreferrer" style="color:#0369a1;font-weight:700;">personal access token guide</a> for creation, storage, rotation, and revocation details.</p>
          </div>
          <div style="border-left:4px solid #ab0520;padding:4px 0 4px 18px;">
            <h3 style="margin:0 0 8px;font-size:16px;color:#111827;">2. Add the sync provider</h3>
            <ol style="margin:0;padding-left:20px;color:#374151;">
              <li>In Token Studio, open <strong>Settings</strong>.</li>
              <li>Under <strong>Sync providers</strong>, select <strong>Add new sync provider</strong> and choose GitHub.</li>
              <li>Enter the PAT and the provider settings below.</li>
              <li>Save the provider, then select <strong>Apply</strong> so it becomes active.</li>
            </ol>
            <p style="margin:10px 0 0;color:#374151;">See Tokens Studio's <a href="https://docs.tokens.studio/token-storage/manage-sync-provider/" target="_blank" rel="noreferrer" style="color:#0369a1;font-weight:700;">sync provider guide</a> for the current plugin interface and provider management options.</p>
          </div>
        </div>
        <dl style="margin:24px 0 0;border:1px solid #d1d5db;background:#f9fafb;display:grid;grid-template-columns:minmax(150px,220px) minmax(0,1fr);">
          <dt style="padding:10px 14px;border-bottom:1px solid #e5e7eb;font-weight:700;">Name</dt>
          <dd style="margin:0;padding:10px 14px;border-bottom:1px solid #e5e7eb;"><code>Arizona Digital Design Tokens</code></dd>
          <dt style="padding:10px 14px;border-bottom:1px solid #e5e7eb;font-weight:700;">Repository</dt>
          <dd style="margin:0;padding:10px 14px;border-bottom:1px solid #e5e7eb;"><code>az-digital/design</code></dd>
          <dt style="padding:10px 14px;border-bottom:1px solid #e5e7eb;font-weight:700;">Branch</dt>
          <dd style="margin:0;padding:10px 14px;border-bottom:1px solid #e5e7eb;"><code>main</code></dd>
          <dt style="padding:10px 14px;font-weight:700;">Token storage location</dt>
          <dd style="margin:0;padding:10px 14px;"><code>packages/tokens/tokens.json</code></dd>
        </dl>
        <p style="margin:12px 0 0;color:#374151;"><strong>Single-file sync:</strong> including the JSON filename in the storage location configures Token Studio to store all tokens in one file. Do not enter a folder path.</p>
      </section>

      <section style="margin-bottom:32px;">
        <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Publish from Figma to repo</h2>
        <ol style="margin:0;padding-left:20px;color:#374151;">
          <li>Pull the latest tokens from <code>main</code> before editing.</li>
          <li>Update tokens in Figma and validate naming and aliasing.</li>
          <li>Create a new branch in Token Studio using the issue number and a short description, for example <code>issue-5-token-update</code>.</li>
          <li>Push changes from Token Studio to that issue branch.</li>
          <li>Open a pull request from the issue branch into <code>main</code>.</li>
          <li>Use the generated Storybook review site to inspect token output before approval.</li>
          <li>Merge after review and approval.</li>
          <li>Build token output to regenerate consumer artifacts.</li>
        </ol>
      </section>

      <section style="margin-bottom:32px;">
        <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Pull from repo to Figma</h2>
        <ol style="margin:0;padding-left:20px;color:#374151;">
          <li>Open the Figma file with Token Studio enabled.</li>
          <li>Configure the GitHub provider to use <code>main</code>.</li>
          <li>Pull the latest repo updates from <code>main</code>.</li>
          <li>Review any name or alias changes before applying them in the design file.</li>
          <li>Update layers to use the new tokens rather than hard-coded values.</li>
        </ol>
      </section>

      <section style="margin-bottom:32px;">
        <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Designer usage guidance</h2>
        <ul style="margin:0;padding-left:20px;color:#374151;">
          <li>Use semantic tokens for production-facing design decisions such as surfaces, borders, and text.</li>
          <li>Use base tokens only for token creation and audits, not for direct production UI assignments.</li>
          <li>Apply tokens through Token Studio bindings so values stay tied to names instead of hardcoded hex values.</li>
        </ul>
      </section>

      <section style="margin-bottom:32px;">
        <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Governance</h2>
        <p style="margin:0 0 12px;color:#374151;">Before merging changes, confirm the scope, review token impacts in Storybook, validate naming and alias structure, and obtain approval from the appropriate reviewers.</p>
        <p style="margin:0;color:#374151;">Request review from the <a href="https://github.com/orgs/az-digital/teams/developers" target="_blank" rel="noreferrer" style="color:#0369a1;font-weight:700;">Arizona Digital developers team</a>. A token change is not canonical until its pull request is approved and merged.</p>
      </section>

      <section style="margin-bottom:32px;">
        <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Troubleshooting</h2>
        <p style="margin:0 0 12px;color:#374151;">Start with Tokens Studio's <a href="https://docs.tokens.studio/token-storage/troubleshooting-common-sync-provider-errors" target="_blank" rel="noreferrer" style="color:#0369a1;font-weight:700;">common sync provider errors guide</a>.</p>
        <ul style="margin:0;padding-left:20px;color:#374151;">
          <li>If sync fails, verify the PAT, repo name, branch, and storage location.</li>
          <li>If tokens appear stale in Figma, confirm the repo branch is current and the token file is the canonical source.</li>
          <li>If values drift, check for direct edits outside the repository token source and regenerate outputs as needed.</li>
        </ul>
      </section>
    </article>
  `;
}
