'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteButton({ propertyId }: { propertyId: number }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('정말 이 매물을 삭제하시겠습니까?')) {
            return;
        }

        setIsDeleting(true);

        try {
            const response = await fetch(`/api/properties/${propertyId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                alert('✅ ' + data.message);
                router.push('/admin/properties');
                router.refresh();
            } else {
                alert('❌ ' + (data.error || '삭제에 실패했습니다.'));
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('❌ 삭제 중 오류가 발생했습니다.');
        } finally {
            setIsDeleting(false); // Reset deleting state
        }
    };

    return (
        <button onClick={handleDelete} className="btn btn-danger btn-sm" disabled={isDeleting}>
            <i className="ti ti-trash me-1"></i>
            {isDeleting ? '삭제 중...' : '삭제'}
        </button>
    );
}
