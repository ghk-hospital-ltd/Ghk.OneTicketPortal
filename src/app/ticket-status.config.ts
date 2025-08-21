export interface TicketStatusConfig {
  status: string;
  message: string;
}

export const TICKET_STATUSES: TicketStatusConfig[] = [
  {
    status: 'journey-incomplete',
    message: 'Patient journey not complete\n<span lang="zh">請耐心等候</span>',
  },
  {
    status: 'journey-complete-invoice-pending',
    message: 'Patient journey complete , invoice not ready\n<span lang="zh">賬單準備中</span>',
  },
  {
    status: 'invoice-ready',
    message: 'Invoice ready\n<span lang="zh">賬單已完成，請到自助服務機結賬或用以下線上付款</span>',
  },
  {
    status: 'invalid',
    message: 'The link is not valid.<br>Please check your ticket with the staff.',
  },
];
