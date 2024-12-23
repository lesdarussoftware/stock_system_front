/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';

import { EditIcon } from '../svg/EditIcon';
import { DeleteIcon } from '../svg/DeleteIcon';
import { AdjustIcon } from '../svg/AdjustIcon';
import { ViewIcon } from '../svg/ViewIcon';

import { ShowFormType } from '../../utils/types';

type TableComponentProps = {
    columns: Array<{ id: string, label: string, accessor: any, sortable?: boolean }>;
    rows: Array<{ [key: string]: any }>;
    setRows: any;
    actions?: boolean;
    filter: any;
    setFilter: (value: any) => void;
    totalRows: number;
    setFormData: (value: any) => void;
    setShowForm: (value: ShowFormType) => void;
    showViewAction?: boolean;
    showEditAction?: boolean;
    showDeleteAction?: boolean;
    showAdjustAction?: boolean;
}

export function TableComponent({
    columns,
    rows,
    setRows,
    actions = false,
    filter,
    setFilter,
    totalRows,
    setFormData,
    setShowForm,
    showViewAction,
    showEditAction,
    showDeleteAction,
    showAdjustAction
}: TableComponentProps) {
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

    const totalPages = Math.ceil(totalRows / filter.offset);

    // Efecto para ordenar las filas cada vez que cambia sortConfig
    useEffect(() => {
        if (!sortConfig) return;

        const sortedRows = [...rows].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        setRows(sortedRows);
    }, [sortConfig]);

    const handleSort = (columnId: string) => {
        setSortConfig((prev) => {
            if (prev?.key === columnId) {
                return { key: columnId, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key: columnId, direction: 'asc' };
        });
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter({
            ...filter,
            offset: Number(event.target.value),
            page: 1
        });
    };

    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        {actions && <th />}
                        {columns.map(col => (
                            <th key={col.id} onClick={() => col.sortable && handleSort(col.id)}>
                                {col.label}
                                {col.sortable && (
                                    <>
                                        {sortConfig?.key === col.id ? (
                                            sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽'
                                        ) : ' ↕'}
                                    </>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ?
                        <tr>
                            <td colSpan={columns.length + (actions ? 1 : 0)} className='text-center'>
                                No hay registros para mostrar.
                            </td>
                        </tr> :
                        rows.map(row => (
                            <tr key={row.id}>
                                {actions &&
                                    <td className='d-flex gap-2'>
                                        {showViewAction &&
                                            <button type="button" className="btn btn-info btn-sm text-white d-flex align-items-center" onClick={() => {
                                                setFormData(row);
                                                setShowForm('VIEW');
                                            }}>
                                                <ViewIcon />
                                            </button>
                                        }
                                        {showEditAction &&
                                            <button type="button" className="btn btn-warning btn-sm text-white d-flex align-items-center" onClick={() => {
                                                setFormData(row);
                                                setShowForm('EDIT');
                                            }}>
                                                <EditIcon />
                                            </button>
                                        }
                                        {showDeleteAction &&
                                            <button type="button" className="btn btn-danger btn-sm d-flex align-items-center" onClick={() => {
                                                setFormData(row);
                                                setShowForm('DELETE');
                                            }}>
                                                <DeleteIcon />
                                            </button>
                                        }
                                        {showAdjustAction &&
                                            <button type="button" className="btn btn-secondary btn-sm text-white d-flex align-items-center" onClick={() => {
                                                setFormData(row);
                                                setShowForm('ADJUST');
                                            }}>
                                                <AdjustIcon />
                                            </button>
                                        }
                                    </td>
                                }
                                {columns.map(col => col.accessor).map((acc, idx) => (
                                    <td key={idx}>
                                        {typeof acc === 'function' ? acc(row) : row[acc]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
            <div className='d-flex align-items-center justify-content-end gap-4'>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Group controlId="rowsPerPageSelect" className='d-flex gap-2 align-items-center'>
                        <Form.Select value={filter.offset} onChange={handleRowsPerPageChange}>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </Form.Select>
                    </Form.Group>
                </div>
                <Pagination>
                    <Pagination.First onClick={() => setFilter({ ...filter, page: 1 })} disabled={filter.page === 1} />
                    <Pagination.Prev onClick={() => setFilter((p: any) => ({ ...p, page: Math.max(1, p - 1) }))} disabled={filter.page === 1} />
                    {[...Array(totalPages)].map((_, idx) => (
                        <Pagination.Item
                            key={idx + 1}
                            active={filter.page === idx + 1}
                            onClick={() => setFilter({ ...filter, page: idx + 1 })}
                        >
                            {idx + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => setFilter((p: any) => ({ ...p, page: Math.min(totalPages, p + 1) }))} disabled={filter.page === totalPages} />
                    <Pagination.Last onClick={() => setFilter({ ...filter, page: totalPages })} disabled={filter.page === totalPages} />
                </Pagination>
            </div>
        </>
    );
}
