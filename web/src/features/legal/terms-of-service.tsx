import { LegalDocumentLayout } from './components/legal-document-layout'
import { TERMS_OF_SERVICE_CONTENT } from './content/terms'

export function TermsOfService() {
  return <LegalDocumentLayout document={TERMS_OF_SERVICE_CONTENT} />
}
