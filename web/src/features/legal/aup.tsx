import { LegalDocumentLayout } from './components/legal-document-layout'
import { AUP_CONTENT } from './content/aup'

export function AcceptableUsePolicy() {
  return <LegalDocumentLayout document={AUP_CONTENT} />
}
