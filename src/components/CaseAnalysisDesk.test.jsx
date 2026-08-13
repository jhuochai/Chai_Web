import { fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import CaseAnalysisDesk from './CaseAnalysisDesk';

const copy = {
  close: '關閉案例分析桌',
  dialogSuffix: '案例分析桌',
  purpose: '素材目的',
  role: '我的工作',
  evidence: '成效證據',
  learning: '學習',
  previous: '上一張',
  next: '下一張',
  play: '播放影片',
  unavailable: '媒體暫時無法顯示',
};

const caseData = {
  id: 'case',
  title: '測試案例',
  items: [
    { id: 'one', type: 'data', title: '第一項', alt: '資料卡', purpose: '第一個目的', role: '企劃', proof: ['證據一', '證據二'], learning: '第一個學習' },
    { id: 'two', type: 'data', title: '第二項', alt: '資料卡', purpose: '第二個目的', role: '分析', proof: ['證據三'], learning: '第二個學習' },
  ],
};

describe('CaseAnalysisDesk', () => {
  it('synchronizes purpose, role, evidence list, and learning with the active card', () => {
    render(<CaseAnalysisDesk caseData={caseData} copy={copy} onClose={vi.fn()} />);

    expect(screen.getByText('第一個目的')).toBeInTheDocument();
    expect(screen.getByText('企劃')).toBeInTheDocument();
    expect(within(screen.getByRole('list', { name: '成效證據' })).getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('第一個學習')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '下一張' }));
    expect(screen.getByText('第二個目的')).toBeInTheDocument();
    expect(screen.getByText('分析')).toBeInTheDocument();
    expect(within(screen.getByRole('list', { name: '成效證據' })).getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByText('第二個學習')).toBeInTheDocument();
  });

  it('closes only from a safe backdrop target', () => {
    const onClose = vi.fn();
    render(<CaseAnalysisDesk caseData={caseData} copy={copy} onClose={onClose} />);

    fireEvent.mouseDown(screen.getByTestId('case-analysis-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
