export function Icon({ name, size = '1x' }: { name: string; size?: string }) {
    const sizeClass = size !== '1x' ? `sa-icon-${size}` : '';

    return (
        <svg className={`sa-icon ${sizeClass}`.trim()}>
            <use href={`/icons/sprite.svg#${name}`} />
        </svg>
    );
}
